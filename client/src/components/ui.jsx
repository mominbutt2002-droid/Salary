import { useEffect } from "react";
import { createPortal } from "react-dom";
import { brandName } from "../data/catalog";
import { formatDateTime, formatMoney, formatSum } from "../utils/format";
import Icon from "./Icon";
import styles from "./ui.module.css";

export function Sheet({ open, title, onClose, children }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return createPortal(
    <div className={styles.backdrop} onClick={onClose}>
      <div
        className={styles.sheet}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
      >
        <header className={styles.sheetHead}>
          <h2>{title}</h2>
          <button type="button" className={styles.iconBtn} onClick={onClose} aria-label="Закрыть">
            <Icon name="close" />
          </button>
        </header>
        {children}
      </div>
    </div>,
    document.body,
  );
}

export function AmountField({ value, onChange, presets }) {
  return (
    <div className={styles.amount}>
      <label className="field">
        <span>Сумма, сум</span>
        <input
          inputMode="numeric"
          value={value ? formatSum(Number(value)) : ""}
          placeholder="0"
          onChange={(event) => onChange(event.target.value.replace(/\D/g, "").slice(0, 9))}
        />
      </label>
      <div className={styles.presets}>
        {presets.map((preset) => (
          <button
            key={preset}
            type="button"
            className={String(preset) === String(value) ? styles.presetOn : styles.preset}
            onClick={() => onChange(String(preset))}
          >
            {formatSum(preset)}
          </button>
        ))}
      </div>
    </div>
  );
}

export function CardPicker({ cards, value, onChange, hidden }) {
  return (
    <div className={styles.picker} role="radiogroup" aria-label="Карта списания">
      {cards.map((card) => (
        <button
          key={card.id}
          type="button"
          role="radio"
          aria-checked={value === card.id}
          disabled={card.frozen}
          className={value === card.id ? styles.pickOn : styles.pick}
          onClick={() => onChange(card.id)}
        >
          <span className={`${styles.brandDot} ${styles[card.brand] || ""}`} />
          <span>
            <strong>
              {brandName(card.brand)} •• {card.last4}
            </strong>
            <small>{card.frozen ? "Заморожена" : card.isPrimary ? "Основная" : "Доступна"}</small>
          </span>
          <b>{hidden ? "••••" : formatSum(card.balance)}</b>
        </button>
      ))}
    </div>
  );
}

export function ReceiptBody({ tx }) {
  const rows = [
    ["Операция", tx.title],
    tx.subtitle ? ["Детали", tx.subtitle] : null,
    tx.account ? ["Реквизит", tx.account] : null,
    tx.cardLabel ? ["Карта", tx.cardLabel] : null,
    tx.type === "payment" || tx.type === "transfer" || tx.type === "merchant"
      ? ["Комиссия", tx.fee ? formatMoney(tx.fee) : "0 сум"]
      : null,
    tx.cashback ? ["Кешбэк", formatMoney(tx.cashback)] : null,
    ["Дата", formatDateTime(tx.createdAt)],
    ["Чек", tx.receipt],
    ["Статус", "Успешно"],
  ].filter(Boolean);

  return (
    <div className={styles.receipt}>
      <p className={tx.amount < 0 ? styles.out : styles.in}>
        {tx.amount < 0 ? "−" : "+"} {formatMoney(Math.abs(tx.amount))}
      </p>
      <dl>
        {rows.map(([label, val]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{val}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function SuccessMark() {
  return (
    <div className={styles.success} aria-hidden="true">
      <Icon name="check" size={28} />
    </div>
  );
}
