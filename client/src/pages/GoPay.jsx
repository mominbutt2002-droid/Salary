import { useState } from "react";
import { AmountField, CardPicker, ReceiptBody, Sheet, SuccessMark } from "../components/ui";
import { useBank } from "../hooks/useBank";
import { merchants } from "../data/catalog";
import { formatMoney } from "../utils/format";
import styles from "./flow.module.css";

export default function GoPay() {
  const { cards, balanceHidden, payMerchant, notify } = useBank();
  const [merchant, setMerchant] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [amount, setAmount] = useState("");
  const [cardId, setCardId] = useState(cards.find((card) => card.isPrimary && !card.frozen)?.id || cards[0]?.id || "");
  const [error, setError] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [receipt, setReceipt] = useState(null);

  const numericAmount = Number(amount || 0);
  const cashback = numericAmount > 0 ? Math.max(1, Math.round(numericAmount * 0.01)) : 0;

  function scan() {
    setScanning(true);
    setError("");
    window.setTimeout(() => {
      const pick = merchants[Math.floor(Math.random() * merchants.length)];
      setMerchant(pick);
      setScanning(false);
    }, 900);
  }

  function askConfirm(event) {
    event.preventDefault();
    if (!merchant) {
      setError("Сначала выберите место или сканируйте код");
      return;
    }
    if (numericAmount < 1000) {
      setError("Минимальная сумма — 1 000 сум");
      return;
    }
    setError("");
    setConfirm(true);
  }

  async function submit() {
    setBusy(true);
    await new Promise((resolve) => setTimeout(resolve, 700));
    const result = payMerchant({ merchant, amount: numericAmount, cardId });
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setConfirm(false);
    setReceipt(result.transaction);
    notify(`Оплачено. Кешбэк ${formatMoney(result.transaction.cashback)}`);
  }

  return (
    <div className="page">
      <div>
        <h1>Оплата Go</h1>
        <p className="lead">Аналог Payme Go и QR в Uzum: оплата на месте без физической карты. В демо сканер выбирает партнёра, кешбэк 1% сразу возвращается на карту.</p>
      </div>
      <div className={styles.scan}>
        {scanning ? <span className={styles.beam} /> : null}
        <div>
          <strong>{scanning ? "Ищем код…" : merchant ? merchant.name : "Наведите на QR"}</strong>
          <p className="muted">{merchant ? merchant.area : "Или выберите место из списка"}</p>
        </div>
      </div>
      <button type="button" className="btn btn-ghost" onClick={scan} data-testid="scan-go">Сканировать QR</button>
      <div className={styles.merchants}>
        {merchants.map((item) => (
          <button
            key={item.id}
            type="button"
            className={merchant?.id === item.id ? styles.merchantOn : styles.merchant}
            onClick={() => setMerchant(item)}
          >
            <span>
              <strong>{item.name}</strong>
              <small>{item.area}</small>
            </span>
            <small>1%</small>
          </button>
        ))}
      </div>
      <form className={styles.form} onSubmit={askConfirm}>
        <AmountField value={amount} onChange={setAmount} presets={[15000, 45000, 80000, 120000]} />
        <div>
          <p className={styles.label}>Карта</p>
          <CardPicker cards={cards} value={cardId} onChange={setCardId} hidden={balanceHidden} />
        </div>
        <div className="summary">
          <div><span>Кешбэк 1%</span><b>{formatMoney(cashback)}</b></div>
          <div><span>Спишется</span><b>{formatMoney(Math.max(0, numericAmount - cashback))}</b></div>
        </div>
        {error && !confirm ? <p className="error">{error}</p> : null}
        <button className="btn btn-primary" type="submit" data-testid="go-submit">Оплатить</button>
      </form>

      <Sheet open={confirm} title={merchant?.name || "Оплата"} onClose={() => { if (!busy) setConfirm(false); }}>
        <div className="summary">
          <div><span>Место</span><b>{merchant?.name}</b></div>
          <div><span>Сумма</span><b>{formatMoney(numericAmount)}</b></div>
          <div><span>Кешбэк</span><b>{formatMoney(cashback)}</b></div>
        </div>
        {error ? <p className="error">{error}</p> : null}
        <button className="btn btn-primary" type="button" disabled={busy} onClick={submit} data-testid="go-confirm">
          {busy ? "Списываем…" : "Подтвердить"}
        </button>
      </Sheet>
      <Sheet open={Boolean(receipt)} title="Чек" onClose={() => setReceipt(null)}>
        <SuccessMark />
        {receipt ? <ReceiptBody tx={receipt} /> : null}
      </Sheet>
    </div>
  );
}
