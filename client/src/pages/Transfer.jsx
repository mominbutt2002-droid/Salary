import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AmountField, CardPicker, ReceiptBody, Sheet, SuccessMark } from "../components/ui";
import { useBank } from "../hooks/useBank";
import { contacts } from "../data/catalog";
import { externalFee, formatCardGroups, formatMoney } from "../utils/format";
import styles from "./flow.module.css";

const modes = [
  ["own", "Свои"],
  ["phone", "По номеру"],
  ["card", "На карту"],
];

export default function Transfer() {
  const { cards, balanceHidden, transfer, notify } = useBank();
  const usable = cards.filter((card) => !card.frozen);
  const [mode, setMode] = useState("own");
  const [fromId, setFromId] = useState(usable.find((card) => card.isPrimary)?.id || usable[0]?.id || "");
  const [toId, setToId] = useState(cards.find((card) => card.id !== fromId)?.id || "");
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [pan, setPan] = useState("");
  const [contactId, setContactId] = useState("");
  const [error, setError] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [receipt, setReceipt] = useState(null);

  const numericAmount = Number(amount || 0);
  const fee = mode === "own" ? 0 : externalFee(numericAmount);
  const destinations = cards.filter((card) => card.id !== fromId);
  const from = useMemo(() => cards.find((card) => card.id === fromId), [cards, fromId]);

  function pickContact(contact) {
    setContactId(contact.id);
    setPhone(contact.phone);
    setRecipientName(contact.name);
  }

  function askConfirm(event) {
    event.preventDefault();
    setError("");
    if (numericAmount < 1000) {
      setError("Минимальная сумма перевода — 1 000 сум");
      return;
    }
    if (mode === "own" && !toId) {
      setError("Добавьте вторую карту, чтобы переводить между своими");
      return;
    }
    setConfirm(true);
  }

  async function submit() {
    setBusy(true);
    setError("");
    await new Promise((resolve) => setTimeout(resolve, 700));
    const result = transfer({
      mode,
      fromId,
      toId,
      amount: numericAmount,
      recipientName,
      recipientDetail: mode === "phone" ? phone : pan,
    });
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setConfirm(false);
    setReceipt(result.transaction);
    notify("Перевод отправлен");
  }

  return (
    <div className="page">
      <div>
        <h1>Перевести</h1>
        <p className="lead">Между своими картами — без комиссии. На номер или карту другого человека — 0,5%, минимум 1 000 сум.</p>
      </div>
      <div className={styles.modes} role="tablist">
        {modes.map(([id, label]) => (
          <button key={id} type="button" className={mode === id ? styles.on : ""} onClick={() => { setMode(id); setError(""); }}>
            {label}
          </button>
        ))}
      </div>
      <form className={styles.form} onSubmit={askConfirm}>
        <div>
          <p className={styles.label}>Откуда</p>
          <CardPicker cards={cards} value={fromId} onChange={setFromId} hidden={balanceHidden} />
        </div>
        {mode === "own" ? (
          <div>
            <p className={styles.label}>Куда</p>
            {destinations.length === 0 ? (
              <p className="muted">Нужна вторая карта. <Link to="/cards">Добавить</Link></p>
            ) : (
              <CardPicker cards={destinations} value={toId} onChange={setToId} hidden={balanceHidden} />
            )}
          </div>
        ) : null}
        {mode === "phone" ? (
          <>
            <div className={styles.contacts}>
              {contacts.map((contact) => (
                <button
                  key={contact.id}
                  type="button"
                  className={contactId === contact.id ? styles.contactOn : styles.contact}
                  onClick={() => pickContact(contact)}
                >
                  <span>
                    <strong>{contact.name}</strong>
                    <small>{contact.phone}</small>
                  </span>
                  <small>{contact.cardMask}</small>
                </button>
              ))}
            </div>
            <label className="field">
              <span>Номер получателя</span>
              <input value={phone} inputMode="tel" placeholder="93 700 12 44" onChange={(event) => { setPhone(event.target.value); setContactId(""); }} />
            </label>
          </>
        ) : null}
        {mode === "card" ? (
          <>
            <label className="field">
              <span>Имя получателя</span>
              <input value={recipientName} placeholder="Как в приложении" onChange={(event) => setRecipientName(event.target.value)} />
            </label>
            <label className="field">
              <span>Номер карты</span>
              <input
                value={formatCardGroups(pan)}
                inputMode="numeric"
                placeholder="8600 0000 0000 0000"
                onChange={(event) => setPan(event.target.value.replace(/\D/g, "").slice(0, 16))}
              />
            </label>
          </>
        ) : null}
        <AmountField value={amount} onChange={setAmount} presets={[50000, 100000, 200000, 500000]} />
        <div className="summary">
          <div><span>Комиссия</span><b>{formatMoney(fee)}</b></div>
          <div><span>Спишется</span><b>{formatMoney(numericAmount + fee)}</b></div>
          {from ? <div><span>Останется</span><b>{balanceHidden ? "••••" : formatMoney(Math.max(0, from.balance - numericAmount - fee))}</b></div> : null}
        </div>
        {error && !confirm ? <p className="error">{error}</p> : null}
        <button className="btn btn-primary" type="submit" data-testid="transfer-submit">Продолжить</button>
      </form>

      <Sheet open={confirm} title="Подтвердить перевод" onClose={() => { if (!busy) setConfirm(false); }}>
        <div className="summary">
          <div><span>Сумма</span><b>{formatMoney(numericAmount)}</b></div>
          <div><span>Комиссия</span><b>{formatMoney(fee)}</b></div>
          <div><span>Карта</span><b>{from ? `•• ${from.last4}` : "—"}</b></div>
        </div>
        {error ? <p className="error">{error}</p> : null}
        <button className="btn btn-primary" type="button" disabled={busy} onClick={submit} data-testid="transfer-confirm">
          {busy ? "Отправляем…" : "Перевести"}
        </button>
      </Sheet>

      <Sheet open={Boolean(receipt)} title="Чек" onClose={() => setReceipt(null)}>
        <SuccessMark />
        {receipt ? <ReceiptBody tx={receipt} /> : null}
      </Sheet>
    </div>
  );
}
