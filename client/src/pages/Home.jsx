import { Link } from "react-router-dom";
import BankCard from "../components/BankCard";
import Icon from "../components/Icon";
import { useBank } from "../hooks/useBank";
import { serviceById } from "../data/catalog";
import { formatDayLabel, formatMoney, greeting } from "../utils/format";
import styles from "./Home.module.css";

const categoryLabel = {
  mobile: "Связь",
  internet: "Интернет",
  utilities: "Коммуналка",
  gov: "Госуслуги",
  transport: "Транспорт",
  tv: "ТВ",
  education: "Учёба",
  shopping: "Покупки",
  food: "Кафе",
  transfer: "Переводы",
  income: "Поступления",
  cashback: "Кешбэк",
  topup: "Пополнение",
};

export default function Home() {
  const { user, cards, transactions, saved, totalBalance, balanceHidden, toggleBalance } = useBank();
  const weekTotal = weekBars(transactions).reduce((sum, bar) => sum + bar.value, 0);
  const bars = weekBars(transactions);
  const maxBar = Math.max(...bars.map((item) => item.value), 1);
  const categories = categorySpend(transactions);

  return (
    <div className={styles.home}>
      <section className={styles.hero}>
        <div className={styles.greet}>
          <p>{greeting()}</p>
          <h2>{user.shortName}</h2>
        </div>
        <div className={styles.balanceRow}>
          <div>
            <span className={styles.kicker}>Доступно на картах</span>
            <p className={styles.total} data-testid="total-balance">
              {balanceHidden ? "••••••" : formatMoney(totalBalance)}
            </p>
          </div>
          <button type="button" className={styles.eye} onClick={toggleBalance} aria-label={balanceHidden ? "Показать баланс" : "Скрыть баланс"}>
            <Icon name={balanceHidden ? "eyeOff" : "eye"} />
          </button>
        </div>
        <div className={styles.scroller}>
          {cards.map((card) => (
            <Link key={card.id} to="/cards" aria-label={`Карта ${card.last4}`}>
              <BankCard card={card} hidden={balanceHidden} compact />
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.actions} aria-label="Быстрые действия">
        <Link to="/payments" className={styles.action}><Icon name="pay" /><span>Оплатить</span></Link>
        <Link to="/transfer" className={styles.action}><Icon name="transfer" /><span>Перевести</span></Link>
        <Link to="/go" className={`${styles.action} ${styles.actionGo}`}><Icon name="qr" /><span>Оплата Go</span></Link>
        <Link to="/cards" className={styles.action}><Icon name="cards" /><span>Карты</span></Link>
      </section>

      <div className={styles.columns}>
        <div className={styles.stack}>
          <section className="panel" style={{ padding: 16 }}>
            <div className={styles.head}>
              <h3>Частые платежи</h3>
            </div>
            <div className={styles.saved}>
              {saved.map((item) => {
                const service = serviceById(item.serviceId);
                if (!service) return null;
                return (
                  <Link key={item.id} to={`/pay/${item.serviceId}?account=${encodeURIComponent(item.account)}`} className={styles.savedItem}>
                    <span className={styles.savedIcon}><Icon name={iconFor(service.category)} size={18} /></span>
                    <strong>{item.label}</strong>
                    <small>{item.account}</small>
                  </Link>
                );
              })}
            </div>
          </section>

          <section className="panel" style={{ padding: 16 }}>
            <div className={styles.head}>
              <h3>Мониторинг</h3>
              <Link to="/history">Все</Link>
            </div>
            <ul className={styles.feed}>
              {transactions.slice(0, 6).map((tx) => (
                <li key={tx.id}>
                  <span className={styles.txIcon}><Icon name={iconFor(tx.category)} size={18} /></span>
                  <span>
                    <strong>{tx.title}</strong>
                    <small>{formatDayLabel(tx.createdAt)} · {tx.cardLabel}</small>
                  </span>
                  <b className={tx.amount < 0 ? styles.out : styles.in}>
                    {balanceHidden ? "••••" : `${tx.amount < 0 ? "−" : "+"} ${formatMoney(Math.abs(tx.amount))}`}
                  </b>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className={styles.sideWidgets}>
          <section className="panel" style={{ padding: 16 }}>
            <h3>Оплаты за 7 дней</h3>
            <p className={styles.spend}>{balanceHidden ? "••••••" : formatMoney(weekTotal)}</p>
            <div className={styles.bars}>
              {bars.map((bar) => (
                <div key={bar.label}>
                  <span style={{ height: `${Math.max(8, (bar.value / maxBar) * 72)}px` }} />
                  <small>{bar.label}</small>
                </div>
              ))}
            </div>
          </section>
          <section className="panel" style={{ padding: 16 }}>
            <h3>По категориям</h3>
            <p className="muted">За этот месяц, без переводов</p>
            <ul className={styles.cats}>
              {categories.map((item) => (
                <li key={item.id}>
                  <span>{categoryLabel[item.id] || item.id}</span>
                  <span className={styles.track}><i style={{ width: `${item.share}%` }} /></span>
                  <b>{balanceHidden ? "••" : formatMoney(item.value)}</b>
                </li>
              ))}
            </ul>
            <p className={styles.note}>Демо-режим: платежи остаются в этом браузере.</p>
          </section>
        </aside>
      </div>
    </div>
  );
}

function iconFor(category) {
  const map = {
    mobile: "phone",
    internet: "wifi",
    utilities: "bolt",
    gov: "gov",
    transport: "bus",
    tv: "tv",
    education: "edu",
    shopping: "bag",
    food: "food",
    transfer: "transfer",
    income: "income",
    cashback: "star",
    topup: "plus",
  };
  return map[category] || "pay";
}

function weekBars(transactions) {
  const days = [];
  for (let offset = 6; offset >= 0; offset -= 1) {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - offset);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    const value = transactions
      .filter((tx) => tx.amount < 0 && tx.type !== "transfer" && new Date(tx.createdAt) >= start && new Date(tx.createdAt) < end)
      .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
    days.push({
      label: start.toLocaleDateString("ru-RU", { weekday: "short" }).slice(0, 2),
      value,
    });
  }
  return days;
}

function categorySpend(transactions) {
  const start = new Date();
  start.setDate(1);
  start.setHours(0, 0, 0, 0);
  const totals = new Map();
  transactions.forEach((tx) => {
    if (tx.amount >= 0 || tx.type === "transfer" || new Date(tx.createdAt) < start) return;
    totals.set(tx.category, (totals.get(tx.category) || 0) + Math.abs(tx.amount));
  });
  const rows = [...totals.entries()].map(([id, value]) => ({ id, value })).sort((a, b) => b.value - a.value).slice(0, 4);
  const max = rows[0]?.value || 1;
  return rows.map((row) => ({ ...row, share: Math.round((row.value / max) * 100) }));
}
