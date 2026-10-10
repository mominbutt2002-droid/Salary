import { brandName } from "../data/catalog";
import { formatMoney } from "../utils/format";
import styles from "./BankCard.module.css";

export default function BankCard({ card, hidden, compact = false, active = false }) {
  return (
    <article
      className={`${styles.card} ${styles[card.brand] || styles.local} ${compact ? styles.compact : ""} ${active ? styles.active : ""} ${card.frozen ? styles.frozen : ""}`}
    >
      <div className={styles.top}>
        <span className={styles.chip} aria-hidden="true" />
        <span className={styles.brand}>{brandName(card.brand)}</span>
      </div>
      <div>
        <p className={styles.number}>•••• •••• •••• {card.last4}</p>
        <p className={styles.balance}>{hidden ? "••••••" : formatMoney(card.balance)}</p>
      </div>
      <div className={styles.bottom}>
        <span>{card.holder}</span>
        <span>{card.expiry}</span>
      </div>
      {card.isPrimary ? <span className={styles.badge}>основная</span> : null}
      {card.frozen ? <span className={styles.frost}>заморожена</span> : null}
    </article>
  );
}
