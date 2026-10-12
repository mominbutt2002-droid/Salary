import { useState } from "react";
import { Link } from "react-router-dom";
import { Sheet } from "../components/ui";
import { useBank } from "../hooks/useBank";
import styles from "./Profile.module.css";

export default function Profile() {
  const { user, themeMode, setThemeMode, cards, totalBalance, balanceHidden, resetDemo } = useBank();
  const [confirm, setConfirm] = useState(false);

  return (
    <div className="page">
      <section className={`panel ${styles.hero}`}>
        <span className={styles.avatar}>{user.initials}</span>
        <div>
          <h1>{user.name}</h1>
          <p className="muted">{user.phone}</p>
        </div>
      </section>
      <section className={`panel ${styles.block}`}>
        <h2>Тема</h2>
        <div className="seg" role="radiogroup" aria-label="Тема оформления">
          {[
            ["light", "Светлая"],
            ["dark", "Тёмная"],
            ["system", "Система"],
          ].map(([id, label]) => (
            <button key={id} type="button" role="radio" aria-checked={themeMode === id} onClick={() => setThemeMode(id)}>
              {label}
            </button>
          ))}
        </div>
      </section>
      <section className={`panel ${styles.block}`}>
        <h2>Счета</h2>
        <p>{cards.length} карты · {balanceHidden ? "баланс скрыт" : `${new Intl.NumberFormat("ru-RU").format(totalBalance)} сум`}</p>
        <div className={styles.links}>
          <Link to="/cards">Управление картами</Link>
          <Link to="/history">Мониторинг</Link>
          <Link to="/payments">Каталог оплат</Link>
        </div>
      </section>
      <section className={`panel ${styles.block}`}>
        <h2>О макете</h2>
        <p>
          Hamyon повторяет повседневные сценарии PAYME и Uzum Bank: карты Uzcard, Humo и Visa, общий баланс,
          каталог услуг, перевод между своими и другим людям, оплата по QR и мониторинг с чеками.
          Все цифры учебные и живут только в этом браузере.
        </p>
        <button type="button" className="btn btn-danger" onClick={() => setConfirm(true)}>Сбросить демо-данные</button>
      </section>
      <Sheet open={confirm} title="Сбросить данные?" onClose={() => setConfirm(false)}>
        <p className={styles.resetText}>Добавленные карты, оплаты и переводы в этом браузере вернутся к исходному макету. Тема сохранится.</p>
        <button
          type="button"
          className="btn btn-danger"
          onClick={() => {
            resetDemo();
            setConfirm(false);
          }}
        >
          Сбросить
        </button>
      </Sheet>
    </div>
  );
}
