import { brandName, serviceById } from "../data/catalog";
import { cardLabel, detectBrand, digitsOnly, externalFee, maskAccount, parseExpiry } from "../utils/format";

function fail(state, error) {
  return { state, result: { ok: false, error } };
}

function spendCard(cards, cardId, total) {
  return cards.map((card) =>
    card.id === cardId ? { ...card, balance: card.balance - total } : card,
  );
}

export function applyPay(state, draft) {
  const service = serviceById(draft.serviceId);
  if (!service) return fail(state, "Услуга не найдена");
  const amount = Math.round(Number(draft.amount));
  if (!Number.isFinite(amount) || amount < 1000) return fail(state, "Минимальная сумма — 1 000 сум");
  if (amount > 20000000) return fail(state, "Сумма слишком большая для демо");

  const accountDigits = digitsOnly(draft.account, 18);
  const account = maskAccount(draft.account, service.accountKind);
  if (service.accountKind === "phone") {
    const local = accountDigits.startsWith("998") ? accountDigits.slice(3) : accountDigits;
    if (local.length !== 9) return fail(state, "Введите номер из 9 цифр, без +998");
  } else if (account.trim().length < 4) {
    return fail(state, "Укажите лицевой счёт или номер");
  }

  const card = state.cards.find((item) => item.id === draft.cardId);
  if (!card) return fail(state, "Выберите карту");
  if (card.frozen) return fail(state, "Карта заморожена. Разморозьте её в разделе «Карты»");
  if (card.balance < amount) return fail(state, "Недостаточно средств на карте");

  const transaction = {
    id: draft.id,
    receipt: draft.receipt,
    type: "payment",
    serviceId: service.id,
    title: service.name,
    subtitle: categoryTitle(service.category),
    amount: -amount,
    fee: 0,
    cashback: 0,
    account,
    cardId: card.id,
    cardLabel: cardLabel(card),
    createdAt: draft.createdAt,
    status: "success",
    category: service.category,
  };

  let saved = state.saved;
  if (draft.save) {
    const exists = saved.some((item) => item.serviceId === service.id && item.account === account);
    if (!exists) {
      saved = [
        { id: `save_${draft.id}`, serviceId: service.id, account, label: service.name },
        ...saved,
      ];
    }
  }

  return {
    state: {
      ...state,
      cards: spendCard(state.cards, card.id, amount),
      transactions: [transaction, ...state.transactions],
      saved,
    },
    result: { ok: true, transaction },
  };
}

export function applyTransfer(state, draft) {
  const amount = Math.round(Number(draft.amount));
  if (!Number.isFinite(amount) || amount < 1000) return fail(state, "Минимальная сумма перевода — 1 000 сум");
  if (amount > 20000000) return fail(state, "Сумма слишком большая для демо");

  const from = state.cards.find((item) => item.id === draft.fromId);
  if (!from) return fail(state, "Выберите карту списания");
  if (from.frozen) return fail(state, "Карта списания заморожена");

  if (draft.mode === "own") {
    const to = state.cards.find((item) => item.id === draft.toId);
    if (!to) return fail(state, "Выберите карту зачисления");
    if (to.id === from.id) return fail(state, "Выберите разные карты");
    if (from.balance < amount) return fail(state, "Недостаточно средств на карте");
    const transaction = {
      id: draft.id,
      receipt: draft.receipt,
      type: "transfer",
      title: "Между своими картами",
      subtitle: `${cardLabel(from)} → ${cardLabel(to)}`,
      amount: -amount,
      fee: 0,
      cashback: 0,
      account: cardLabel(to),
      cardId: from.id,
      cardLabel: cardLabel(from),
      toCardId: to.id,
      createdAt: draft.createdAt,
      status: "success",
      category: "transfer",
    };
    return {
      state: {
        ...state,
        cards: state.cards.map((card) => {
          if (card.id === from.id) return { ...card, balance: card.balance - amount };
          if (card.id === to.id) return { ...card, balance: card.balance + amount };
          return card;
        }),
        transactions: [transaction, ...state.transactions],
      },
      result: { ok: true, transaction },
    };
  }

  const detail = String(draft.recipientDetail || "").trim();
  if (draft.mode === "phone") {
    const phone = digitsOnly(detail, 12);
    const local = phone.startsWith("998") ? phone.slice(3) : phone;
    if (local.length !== 9) return fail(state, "Введите номер получателя из 9 цифр");
  } else {
    const pan = digitsOnly(detail, 16);
    if (pan.length !== 16) return fail(state, "Номер карты получателя — 16 цифр");
    if (state.cards.some((card) => card.number === pan)) {
      return fail(state, "Это ваша карта. Выберите перевод между своими");
    }
  }

  const fee = externalFee(amount);
  const total = amount + fee;
  if (from.balance < total) return fail(state, "Недостаточно средств с учётом комиссии");

  const name = String(draft.recipientName || "").trim() || (draft.mode === "phone" ? "Перевод по номеру" : "Перевод на карту");
  const transaction = {
    id: draft.id,
    receipt: draft.receipt,
    type: "transfer",
    title: name,
    subtitle: draft.mode === "phone" ? "Перевод по номеру" : "Перевод на карту",
    amount: -total,
    fee,
    cashback: 0,
    account: draft.mode === "phone" ? maskAccount(detail, "phone") : formatPanMask(detail),
    cardId: from.id,
    cardLabel: cardLabel(from),
    createdAt: draft.createdAt,
    status: "success",
    category: "transfer",
  };

  return {
    state: {
      ...state,
      cards: spendCard(state.cards, from.id, total),
      transactions: [transaction, ...state.transactions],
    },
    result: { ok: true, transaction },
  };
}

export function applyMerchant(state, draft) {
  const amount = Math.round(Number(draft.amount));
  if (!Number.isFinite(amount) || amount < 1000) return fail(state, "Минимальная сумма — 1 000 сум");
  if (amount > 20000000) return fail(state, "Сумма слишком большая для демо");
  if (!draft.merchant) return fail(state, "Выберите место оплаты");
  const card = state.cards.find((item) => item.id === draft.cardId);
  if (!card) return fail(state, "Выберите карту");
  if (card.frozen) return fail(state, "Карта заморожена");
  if (card.balance < amount) return fail(state, "Недостаточно средств на карте");

  const cashback = Math.max(1, Math.round(amount * 0.01));
  const payment = {
    id: draft.id,
    receipt: draft.receipt,
    type: "merchant",
    title: draft.merchant.name,
    subtitle: draft.merchant.area,
    amount: -amount,
    fee: 0,
    cashback,
    account: "",
    cardId: card.id,
    cardLabel: cardLabel(card),
    createdAt: draft.createdAt,
    status: "success",
    category: draft.merchant.category,
  };
  const bonus = {
    id: `${draft.id}_cb`,
    receipt: `${draft.receipt}-K`,
    type: "cashback",
    title: `Кешбэк ${draft.merchant.name}`,
    subtitle: "1% за оплату Go",
    amount: cashback,
    fee: 0,
    cashback: 0,
    account: "",
    cardId: card.id,
    cardLabel: cardLabel(card),
    createdAt: draft.createdAt,
    status: "success",
    category: "cashback",
  };

  return {
    state: {
      ...state,
      cards: state.cards.map((item) =>
        item.id === card.id ? { ...item, balance: item.balance - amount + cashback } : item,
      ),
      transactions: [bonus, payment, ...state.transactions],
    },
    result: { ok: true, transaction: payment },
  };
}

export function applyTopUp(state, draft) {
  const amount = Math.round(Number(draft.amount));
  if (!Number.isFinite(amount) || amount < 1000) return fail(state, "Минимальное пополнение — 1 000 сум");
  if (amount > 50000000) return fail(state, "Слишком большая сумма для демо");
  const card = state.cards.find((item) => item.id === draft.cardId);
  if (!card) return fail(state, "Выберите карту");
  const transaction = {
    id: draft.id,
    receipt: draft.receipt,
    type: "topup",
    title: "Пополнение",
    subtitle: "Демо-зачисление",
    amount,
    fee: 0,
    cashback: 0,
    account: "",
    cardId: card.id,
    cardLabel: cardLabel(card),
    createdAt: draft.createdAt,
    status: "success",
    category: "topup",
  };
  return {
    state: {
      ...state,
      cards: state.cards.map((item) =>
        item.id === card.id ? { ...item, balance: item.balance + amount } : item,
      ),
      transactions: [transaction, ...state.transactions],
    },
    result: { ok: true, transaction },
  };
}

export function applyAddCard(state, draft) {
  const number = digitsOnly(draft.number, 16);
  if (number.length !== 16) return fail(state, "Номер карты должен содержать 16 цифр");
  const expiry = parseExpiry(draft.expiry);
  if (!expiry) return fail(state, "Срок действия указан неверно или карта просрочена");
  const holder = String(draft.holder || "").trim().replace(/\s+/g, " ");
  if (holder.length < 2) return fail(state, "Укажите имя держателя");
  if (state.cards.some((card) => card.number === number)) return fail(state, "Такая карта уже добавлена");

  const card = {
    id: draft.id,
    brand: detectBrand(number),
    number,
    last4: number.slice(-4),
    holder: holder.toUpperCase(),
    expiry,
    balance: 0,
    frozen: false,
    isPrimary: state.cards.length === 0,
  };
  return {
    state: { ...state, cards: [...state.cards, card] },
    result: { ok: true, card },
  };
}

export function applyRemoveCard(state, cardId) {
  const card = state.cards.find((item) => item.id === cardId);
  if (!card) return fail(state, "Карта не найдена");
  if (state.cards.length === 1) return fail(state, "Нужно оставить хотя бы одну карту");
  if (card.balance > 0) return fail(state, "Сначала переведите остаток на другую карту");
  let cards = state.cards.filter((item) => item.id !== cardId);
  if (card.isPrimary) {
    cards = cards.map((item, index) => ({ ...item, isPrimary: index === 0 }));
  }
  return { state: { ...state, cards }, result: { ok: true } };
}

export function applyFreeze(state, cardId) {
  return {
    ...state,
    cards: state.cards.map((card) =>
      card.id === cardId ? { ...card, frozen: !card.frozen } : card,
    ),
  };
}

export function applyPrimary(state, cardId) {
  return {
    ...state,
    cards: state.cards.map((card) => ({ ...card, isPrimary: card.id === cardId })),
  };
}

function categoryTitle(id) {
  const titles = {
    mobile: "Мобильная связь",
    internet: "Интернет",
    utilities: "Коммунальные",
    gov: "Госуслуги",
    transport: "Транспорт",
    tv: "Телевидение",
    education: "Образование",
  };
  return titles[id] || "Оплата";
}

function formatPanMask(value) {
  const digits = digitsOnly(value, 16);
  return `${brandName(detectBrand(digits))} •• ${digits.slice(-4)}`;
}
