const BRANDS = {
  uzcard: "Uzcard",
  humo: "Humo",
  visa: "Visa",
  mastercard: "Mastercard",
  local: "Карта",
};

export const brandName = (brand) => BRANDS[brand] || BRANDS.local;

export const categories = [
  { id: "mobile", title: "Мобильная связь", hint: "Beeline, Ucell, Mobiuz", icon: "phone" },
  { id: "internet", title: "Интернет", hint: "Домашний и офисный", icon: "wifi" },
  { id: "utilities", title: "Коммунальные", hint: "Свет, газ, вода", icon: "bolt" },
  { id: "gov", title: "Госуслуги", hint: "Налоги и штрафы", icon: "gov" },
  { id: "transport", title: "Транспорт", hint: "Метро и автобус", icon: "bus" },
  { id: "tv", title: "Телевидение", hint: "Цифровое ТВ", icon: "tv" },
  { id: "education", title: "Образование", hint: "Сады и курсы", icon: "edu" },
];

export const services = [
  svc("beeline", "mobile", "Beeline", "phone", ["билайн", "beeline"], [10000, 20000, 50000, 100000]),
  svc("ucell", "mobile", "Ucell", "phone", ["юсел", "ucell"], [10000, 20000, 50000, 100000]),
  svc("uzmobile", "mobile", "Uzmobile", "phone", ["узмобайл"], [10000, 20000, 50000]),
  svc("mobiuz", "mobile", "Mobiuz", "phone", ["мобиуз"], [10000, 20000, 50000]),
  svc("humans", "mobile", "Humans", "phone", ["хуманс"], [20000, 50000, 100000]),
  svc("uztelecom", "internet", "Uztelecom", "account", ["узтелеком", "интернет"], [50000, 80000, 99000, 150000]),
  svc("sarkor", "internet", "Sarkor Telecom", "account", ["sarkor", "сарко"], [70000, 100000, 140000]),
  svc("tps", "internet", "TPS", "account", ["тпс"], [60000, 90000, 120000]),
  svc("power", "utilities", "Электричество", "account", ["свет", "электро", "hudud"], [30000, 50000, 87400, 120000]),
  svc("gas", "utilities", "Hududgaz", "account", ["газ"], [20000, 41200, 80000]),
  svc("water", "utilities", "Водоканал", "account", ["вода"], [15000, 25000, 40000]),
  svc("waste", "utilities", "Вывоз мусора", "account", ["мусор", "mahsus"], [12000, 18000, 25000]),
  svc("tax", "gov", "Налоги", "account", ["солиқ", "налог"], [50000, 150000, 300000]),
  svc("fine", "gov", "Штрафы ГУБДД", "account", ["штраф", "гибдд", "yhxb"], [170000, 340000, 680000]),
  svc("duty", "gov", "Госпошлина", "account", ["пошлина"], [50000, 100000, 202000]),
  svc("atto", "transport", "ATTO", "atto", ["метро", "автобус", "атто"], [2000, 5000, 10000, 20000]),
  svc("uzdigital", "tv", "UzDigital", "account", ["тв", "телевизор"], [25000, 40000, 55000]),
  svc("mediabay", "tv", "Mediabay", "account", ["медиабай"], [20000, 35000, 50000]),
  svc("kindergarten", "education", "Детский сад", "account", ["сад", "садик"], [500000, 800000, 1200000]),
];

function svc(id, category, name, accountKind, keywords, presets) {
  const labels = {
    phone: ["Номер телефона", "90 123 45 67"],
    account: ["Лицевой счёт", "452190881"],
    atto: ["Номер карты ATTO", "9988 1200 4412"],
  };
  const [accountLabel, accountPlaceholder] = labels[accountKind];
  return {
    id,
    category,
    name,
    accountKind,
    accountLabel,
    accountPlaceholder,
    keywords,
    presets,
    feeRate: 0,
  };
}

export const merchants = [
  { id: "korzinka", name: "Korzinka", area: "Юнусабад", category: "shopping" },
  { id: "makro", name: "Makro", area: "Чиланзар", category: "shopping" },
  { id: "evos", name: "Evos", area: "Мирабад", category: "food" },
  { id: "oqtepa", name: "Oqtepa Lavash", area: "Яккасарай", category: "food" },
  { id: "mediapark", name: "Mediapark", area: "Сергели", category: "shopping" },
  { id: "coffee", name: "Bean & Co", area: "Шайхантахур", category: "food" },
];

export const contacts = [
  { id: "jasur", name: "Жасур Алиев", phone: "+998 93 700 12 44", cardMask: "Humo •• 2291" },
  { id: "nigora", name: "Нигора Саидова", phone: "+998 97 445 80 11", cardMask: "Uzcard •• 9014" },
  { id: "behzod", name: "Бехзод Рахимов", phone: "+998 88 210 55 03", cardMask: "Uzcard •• 1180" },
  { id: "dilnoza", name: "Дилноза Каримова", phone: "+998 90 555 19 27", cardMask: "Humo •• 6620" },
];

export const userProfile = {
  name: "Малика Юсупова",
  shortName: "Малика",
  phone: "+998 90 312 44 18",
  initials: "МЮ",
};

export const STORAGE_KEY = "hamyon-demo-v1";

export function categoryById(id) {
  return categories.find((item) => item.id === id);
}

export function serviceById(id) {
  return services.find((item) => item.id === id);
}

function at(daysAgo, hours, minutes) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(hours, minutes, 0, 0);
  return date.toISOString();
}

function tx(partial) {
  return {
    fee: 0,
    cashback: 0,
    account: "",
    status: "success",
    serviceId: "",
    ...partial,
  };
}

export function createSeed() {
  return {
    version: 1,
    themeMode: "system",
    balanceHidden: false,
    cards: [
      {
        id: "card_uz",
        brand: "uzcard",
        number: "8600123456784412",
        last4: "4412",
        holder: "MALIKA YUSUPOVA",
        expiry: "09/28",
        balance: 8450000,
        frozen: false,
        isPrimary: true,
      },
      {
        id: "card_humo",
        brand: "humo",
        number: "9860091233447781",
        last4: "7781",
        holder: "MALIKA YUSUPOVA",
        expiry: "03/27",
        balance: 2180000,
        frozen: false,
        isPrimary: false,
      },
      {
        id: "card_visa",
        brand: "visa",
        number: "4278320011905520",
        last4: "5520",
        holder: "MALIKA YUSUPOVA",
        expiry: "12/28",
        balance: 6750000,
        frozen: false,
        isPrimary: false,
      },
    ],
    saved: [
      { id: "save_beeline", serviceId: "beeline", account: "90 312 44 18", label: "Мой Beeline" },
      { id: "save_power", serviceId: "power", account: "452190881", label: "Свет, дом" },
      { id: "save_net", serviceId: "uztelecom", account: "100245778", label: "Домашний интернет" },
    ],
    transactions: [
      tx({
        id: "tx_evos",
        receipt: "HM-240181",
        type: "merchant",
        title: "Evos",
        subtitle: "Мирабад",
        amount: -45000,
        cashback: 450,
        cardId: "card_humo",
        cardLabel: "Humo •• 7781",
        createdAt: at(0, 10, 24),
        category: "food",
      }),
      tx({
        id: "tx_atto",
        receipt: "HM-240176",
        type: "payment",
        serviceId: "atto",
        title: "ATTO",
        subtitle: "Транспорт",
        amount: -5000,
        account: "9988 1200 4412",
        cardId: "card_uz",
        cardLabel: "Uzcard •• 4412",
        createdAt: at(0, 8, 41),
        category: "transport",
      }),
      tx({
        id: "tx_beeline",
        receipt: "HM-240102",
        type: "payment",
        serviceId: "beeline",
        title: "Beeline",
        subtitle: "Мобильная связь",
        amount: -50000,
        account: "90 312 44 18",
        cardId: "card_uz",
        cardLabel: "Uzcard •• 4412",
        createdAt: at(1, 19, 5),
        category: "mobile",
      }),
      tx({
        id: "tx_korzinka",
        receipt: "HM-239994",
        type: "merchant",
        title: "Korzinka",
        subtitle: "Юнусабад",
        amount: -186000,
        cashback: 1860,
        cardId: "card_visa",
        cardLabel: "Visa •• 5520",
        createdAt: at(1, 13, 12),
        category: "shopping",
      }),
      tx({
        id: "tx_cashback",
        receipt: "HM-239995",
        type: "cashback",
        title: "Кешбэк Korzinka",
        subtitle: "1% за оплату Go",
        amount: 1860,
        cardId: "card_visa",
        cardLabel: "Visa •• 5520",
        createdAt: at(1, 13, 12),
        category: "cashback",
      }),
      tx({
        id: "tx_power",
        receipt: "HM-239880",
        type: "payment",
        serviceId: "power",
        title: "Электричество",
        subtitle: "Коммунальные",
        amount: -87400,
        account: "452190881",
        cardId: "card_uz",
        cardLabel: "Uzcard •• 4412",
        createdAt: at(2, 18, 20),
        category: "utilities",
      }),
      tx({
        id: "tx_salary",
        receipt: "HM-239701",
        type: "income",
        title: "Зарплата",
        subtitle: "Поступление на Uzcard",
        amount: 2400000,
        cardId: "card_uz",
        cardLabel: "Uzcard •• 4412",
        createdAt: at(3, 9, 2),
        category: "income",
      }),
      tx({
        id: "tx_coffee",
        receipt: "HM-239640",
        type: "merchant",
        title: "Bean & Co",
        subtitle: "Шайхантахур",
        amount: -28000,
        cashback: 280,
        cardId: "card_visa",
        cardLabel: "Visa •• 5520",
        createdAt: at(3, 16, 48),
        category: "food",
      }),
      tx({
        id: "tx_p2p",
        receipt: "HM-239510",
        type: "transfer",
        title: "Жасур Алиев",
        subtitle: "Перевод по номеру",
        amount: -201000,
        fee: 1000,
        account: "+998 93 700 12 44",
        cardId: "card_humo",
        cardLabel: "Humo •• 7781",
        createdAt: at(4, 21, 16),
        category: "transfer",
      }),
      tx({
        id: "tx_net",
        receipt: "HM-239330",
        type: "payment",
        serviceId: "uztelecom",
        title: "Uztelecom",
        subtitle: "Интернет",
        amount: -99000,
        account: "100245778",
        cardId: "card_uz",
        cardLabel: "Uzcard •• 4412",
        createdAt: at(5, 11, 4),
        category: "internet",
      }),
      tx({
        id: "tx_gas",
        receipt: "HM-239210",
        type: "payment",
        serviceId: "gas",
        title: "Hududgaz",
        subtitle: "Коммунальные",
        amount: -41200,
        account: "88332011",
        cardId: "card_uz",
        cardLabel: "Uzcard •• 4412",
        createdAt: at(6, 17, 36),
        category: "utilities",
      }),
    ],
  };
}
