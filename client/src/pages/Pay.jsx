import { useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { AmountField, CardPicker, ReceiptBody, Sheet, SuccessMark } from "../components/ui";
import { useBank } from "../hooks/useBank";
import { categoryById, serviceById } from "../data/catalog";
import { formatMoney } from "../utils/format";
import styles from "./flow.module.css";

export default function Pay() {
  const { serviceId } = useParams();
  const [params] = useSearchParams();
  const service = serviceById(serviceId);
  const { cards, balanceHidden, pay, notify } = useBank();
  const initialCard = cards.find((card) => card.isPrimary && !card.frozen) || cards.find((card) => !card.frozen);
  const [account, setAccount] = useState(params.get("account") || "");
  const [amount, setAmount] = useState("");
  const [cardId, setCardId] = useState(initialCard?.id || "");
  const [save, setSave] = useState(true);
  const [error, setError] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [receipt, setReceipt] = useState(null);

  const card = useMemo(() => cards.find((item) => item.id === cardId), [cards, cardId]);
  if (!service) {
    return (
      <div className="page">
        <h1>Услуга не найдена</h1>
        <Link to="/payments">Вернуться к платежам</Link>
      </div>
    );
  }

  const numericAmount = Number(amount || 0);

  function askConfirm(event) {
    event.preventDefault();
    setError("");
    if (!account.trim()) {
      setError("Заполните реквизит");
      return;
    }
    if (numericAmount < 1000) {
      setError("Минимальная сумма — 1 000 сум");
      return;
    }
    setConfirm(true);
  }

  async function submit() {
    setBusy(true);
    setError("");
    await new Promise((resolve) => setTimeout(resolve, 700));
    const result = pay({ serviceId: service.id, account, amount: numericAmount, cardId, save });
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setConfirm(false);
    setReceipt(result.transaction);
    notify("Платёж прошёл");
  }

  return (
    <div className="page">
      <Link to="/payments" className={styles.back}>Назад к услугам</Link>
      <div>
        <p className="muted">{categoryById(service.category)?.title}</p>
        <h1>{service.name}</h1>
      </div>
      <form className={styles.form} onSubmit={askConfirm}>
        <label className="field">
          <span>{service.accountLabel}</span>
          <input
            value={account}
            placeholder={service.accountPlaceholder}
            onChange={(event) => setAccount(event.target.value)}
            inputMode={service.accountKind === "phone" ? "tel" : "text"}
          />
        </label>
        <AmountField value={amount} onChange={setAmount} presets={service.presets} />
        <div>
          <p className={styles.label}>Списать с карты</p>
          <CardPicker cards={cards} value={cardId} onChange={setCardId} hidden={balanceHidden} />
        </div>
        <label className="checkline">
          <input type="checkbox" checked={save} onChange={(event) => setSave(event.target.checked)} />
          Сохранить в частых платежах
        </label>
        <div className="summary">
          <div><span>Комиссия</span><b>0 сум</b></div>
          <div><span>Итого</span><b>{formatMoney(numericAmount || 0)}</b></div>
        </div>
        {error && !confirm ? <p className="error">{error}</p> : null}
        <button className="btn btn-primary" type="submit" data-testid="pay-submit">Продолжить</button>
      </form>

      <Sheet open={confirm} title="Подтверждение" onClose={() => { if (!busy) setConfirm(false); }}>
        <div className="summary">
          <div><span>Услуга</span><b>{service.name}</b></div>
          <div><span>Реквизит</span><b>{account}</b></div>
          <div><span>Карта</span><b>{card ? `•• ${card.last4}` : "—"}</b></div>
          <div><span>К оплате</span><b>{formatMoney(numericAmount)}</b></div>
        </div>
        {error ? <p className="error">{error}</p> : null}
        <button className="btn btn-primary" type="button" disabled={busy} onClick={submit} data-testid="pay-confirm">
          {busy ? "Проводим платёж…" : "Оплатить"}
        </button>
      </Sheet>

      <Sheet open={Boolean(receipt)} title="Чек" onClose={() => setReceipt(null)}>
        <SuccessMark />
        {receipt ? <ReceiptBody tx={receipt} /> : null}
        <Link to="/" className="btn btn-primary" style={{ marginTop: 16 }}>На главную</Link>
      </Sheet>
    </div>
  );
}
