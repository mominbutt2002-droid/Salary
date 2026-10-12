import { useState } from "react";
import BankCard from "../components/BankCard";
import { AmountField, Sheet } from "../components/ui";
import { useBank } from "../hooks/useBank";
import { brandName } from "../data/catalog";
import { detectBrand, formatCardGroups, formatExpiryInput, formatMoney } from "../utils/format";
import styles from "./Cards.module.css";

const emptyForm = { number: "", expiry: "", holder: "" };

export default function Cards() {
  const { cards, balanceHidden, addCard, removeCard, toggleFreeze, setPrimary, topUp, notify } = useBank();
  const [selected, setSelected] = useState(cards.find((card) => card.isPrimary)?.id || cards[0]?.id);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [topupFor, setTopupFor] = useState(null);
  const [topupAmount, setTopupAmount] = useState("100000");
  const card = cards.find((item) => item.id === selected) || cards[0];
  const previewBrand = detectBrand(form.number);

  function submitCard(event) {
    event.preventDefault();
    const result = addCard(form);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setAdding(false);
    setForm(emptyForm);
    setError("");
    setSelected(result.card.id);
    notify(`${brandName(result.card.brand)} •• ${result.card.last4} добавлена`);
  }

  function onRemove() {
    const result = removeCard(card.id);
    if (!result.ok) {
      notify(result.error, "bad");
      return;
    }
    setSelected(cards.find((item) => item.id !== card.id)?.id);
    notify("Карта удалена");
  }

  function submitTopup(event) {
    event.preventDefault();
    const result = topUp({ cardId: topupFor, amount: Number(topupAmount) });
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setTopupFor(null);
    setError("");
    notify("Демо-пополнение зачислено");
  }

  return (
    <div className="page">
      <div className={styles.head}>
        <div>
          <h1>Карты</h1>
          <p className="lead">Uzcard, Humo и Visa. Баланс обновляется сразу после оплаты или перевода.</p>
        </div>
        <button type="button" className="btn btn-primary" style={{ width: "auto" }} onClick={() => { setAdding(true); setError(""); }} data-testid="add-card">
          Добавить карту
        </button>
      </div>
      <div className={styles.grid}>
        {cards.map((item) => (
          <button key={item.id} type="button" className={styles.pick} onClick={() => setSelected(item.id)}>
            <BankCard card={item} hidden={balanceHidden} active={item.id === card?.id} />
          </button>
        ))}
      </div>
      {card ? (
        <section className={`panel ${styles.detail}`}>
          <h2>{brandName(card.brand)} •• {card.last4}</h2>
          <p className={styles.money}>{balanceHidden ? "••••••" : formatMoney(card.balance)}</p>
          <div className={styles.actions}>
            <button type="button" className="btn btn-ghost" onClick={() => { setPrimary(card.id); notify("Основная карта изменена"); }} disabled={card.isPrimary}>
              {card.isPrimary ? "Основная" : "Сделать основной"}
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => { toggleFreeze(card.id); notify(card.frozen ? "Карта разморожена" : "Карта заморожена"); }}>
              {card.frozen ? "Разморозить" : "Заморозить"}
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => { setTopupFor(card.id); setError(""); }}>
              Пополнить
            </button>
            <button type="button" className="btn btn-danger" onClick={onRemove}>Удалить</button>
          </div>
          <p className="muted">Пополнение — учебное: деньги не приходят из банка, а рисуются в макете, чтобы можно было продолжить оплаты.</p>
        </section>
      ) : null}

      <Sheet open={adding} title="Новая карта" onClose={() => setAdding(false)}>
        <div className={styles.preview}>
          <BankCard
            card={{
              brand: previewBrand,
              last4: form.number.slice(-4).padEnd(4, "•"),
              holder: form.holder || "ИМЯ ФАМИЛИЯ",
              expiry: form.expiry || "MM/YY",
              balance: 0,
              isPrimary: false,
              frozen: false,
            }}
            hidden
          />
        </div>
        <form className={styles.form} onSubmit={submitCard}>
          <label className="field">
            <span>Номер карты</span>
            <input
              inputMode="numeric"
              placeholder="8600 1234 5678 4412"
              value={formatCardGroups(form.number)}
              onChange={(event) => setForm({ ...form, number: event.target.value.replace(/\D/g, "").slice(0, 16) })}
            />
          </label>
          <label className="field">
            <span>Срок</span>
            <input
              inputMode="numeric"
              placeholder="09/28"
              value={form.expiry}
              onChange={(event) => setForm({ ...form, expiry: formatExpiryInput(event.target.value) })}
            />
          </label>
          <label className="field">
            <span>Держатель</span>
            <input
              placeholder="MALIKA YUSUPOVA"
              value={form.holder}
              onChange={(event) => setForm({ ...form, holder: event.target.value.toUpperCase() })}
            />
          </label>
          <p className="muted">8600 — Uzcard, 9860 — Humo, 4 — Visa. Новая карта открывается с нулевым балансом.</p>
          {error ? <p className="error">{error}</p> : null}
          <button className="btn btn-primary" type="submit" data-testid="save-card">Сохранить карту</button>
        </form>
      </Sheet>

      <Sheet open={Boolean(topupFor)} title="Пополнить карту" onClose={() => setTopupFor(null)}>
        <form className={styles.form} onSubmit={submitTopup}>
          <AmountField value={topupAmount} onChange={setTopupAmount} presets={[100000, 500000, 1000000, 2000000]} />
          {error ? <p className="error">{error}</p> : null}
          <button className="btn btn-primary" type="submit" data-testid="topup-submit">Зачислить демо-сумму</button>
        </form>
      </Sheet>
    </div>
  );
}
