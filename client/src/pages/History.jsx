import { useMemo, useState } from "react";
import Icon from "../components/Icon";
import { ReceiptBody, Sheet } from "../components/ui";
import { useBank } from "../hooks/useBank";
import { formatDayLabel, formatMoney } from "../utils/format";
import styles from "./History.module.css";

const filters = [
  ["all", "Все"],
  ["out", "Списания"],
  ["in", "Поступления"],
];

export default function History() {
  const { transactions, balanceHidden } = useBank();
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [opened, setOpened] = useState(null);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return transactions.filter((tx) => {
      if (filter === "out" && tx.amount >= 0) return false;
      if (filter === "in" && tx.amount < 0) return false;
      if (!q) return true;
      return `${tx.title} ${tx.subtitle} ${tx.account} ${tx.cardLabel}`.toLowerCase().includes(q);
    });
  }, [transactions, filter, query]);

  const groups = useMemo(() => {
    const map = new Map();
    list.forEach((tx) => {
      const label = formatDayLabel(tx.createdAt);
      if (!map.has(label)) map.set(label, []);
      map.get(label).push(tx);
    });
    return [...map.entries()];
  }, [list]);

  return (
    <div className="page">
      <div>
        <h1>Мониторинг</h1>
        <p className="lead">Чеки не пропадают: откройте операцию и посмотрите сумму, карту и номер.</p>
      </div>
      <div className={styles.filters}>
        {filters.map(([id, label]) => (
          <button key={id} type="button" className={filter === id ? styles.on : ""} onClick={() => setFilter(id)}>
            {label}
          </button>
        ))}
      </div>
      <label className={styles.search}>
        <Icon name="search" size={18} />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Поиск по операциям" aria-label="Поиск по операциям" />
      </label>
      {groups.length === 0 ? <p className="muted">Операций пока нет.</p> : null}
      {groups.map(([label, items]) => (
        <section key={label}>
          <h2>{label}</h2>
          <ul className={styles.list}>
            {items.map((tx) => (
              <li key={tx.id}>
                <button type="button" onClick={() => setOpened(tx)}>
                  <span>
                    <strong>{tx.title}</strong>
                    <small>{tx.subtitle || tx.cardLabel}</small>
                  </span>
                  <b className={tx.amount < 0 ? styles.out : styles.in}>
                    {balanceHidden ? "••••" : `${tx.amount < 0 ? "−" : "+"} ${formatMoney(Math.abs(tx.amount))}`}
                  </b>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}
      <Sheet open={Boolean(opened)} title="Чек" onClose={() => setOpened(null)}>
        {opened ? <ReceiptBody tx={opened} /> : null}
      </Sheet>
    </div>
  );
}
