import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useBank } from "../hooks/useBank";
import Icon from "./Icon";
import styles from "./Shell.module.css";

const titles = {
  "/": "Главная",
  "/payments": "Платежи",
  "/transfer": "Переводы",
  "/cards": "Карты",
  "/history": "Мониторинг",
  "/go": "Оплата Go",
  "/profile": "Профиль",
};

function titleFor(pathname) {
  if (pathname.startsWith("/pay/")) return "Оплата";
  return titles[pathname] || "Hamyon";
}

export default function Shell() {
  const { theme, toggleTheme, user } = useBank();
  const { pathname } = useLocation();
  const title = titleFor(pathname);
  const [noticePath, setNoticePath] = useState("");
  const noticesOpen = noticePath === pathname;

  useEffect(() => {
    document.title = pathname === "/" ? "Hamyon — онлайн-банк" : `${title} — Hamyon`;
  }, [pathname, title]);

  return (
    <div className={styles.shell}>
      <aside className={styles.side}>
        <NavLink to="/" className={styles.logo} end>
          <span className={styles.mark}>H</span>
          <span>
            <strong>Hamyon</strong>
            <small>онлайн-банк</small>
          </span>
        </NavLink>
        <nav className={styles.nav}>
          <SideLink to="/" icon="home" label="Главная" end />
          <SideLink to="/payments" icon="pay" label="Платежи" />
          <SideLink to="/transfer" icon="transfer" label="Переводы" />
          <SideLink to="/go" icon="qr" label="Оплата Go" />
          <SideLink to="/cards" icon="cards" label="Карты" />
          <SideLink to="/history" icon="income" label="Мониторинг" />
        </nav>
        <NavLink to="/profile" className={styles.user}>
          <span className={styles.avatar}>{user.initials}</span>
          <span>
            <strong>{user.name}</strong>
            <small>{user.phone}</small>
          </span>
        </NavLink>
      </aside>

      <div className={styles.main}>
        <header className={styles.top}>
          <div className={styles.topTitle}>
            <NavLink to="/" className={styles.logoMobile}>
              <span className={styles.mark}>H</span>
              Hamyon
            </NavLink>
            <p className={styles.pageName}>{pathname === "/" ? "Главная" : title}</p>
          </div>
          <div className={styles.tools}>
            <button
              type="button"
              className={styles.tool}
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Включить светлую тему" : "Включить тёмную тему"}
              data-testid="theme-toggle"
            >
              <Icon name={theme === "dark" ? "sun" : "moon"} />
            </button>
            <div className={styles.noticeWrap}>
              <button
                type="button"
                className={styles.tool}
                aria-label="Уведомления"
                aria-expanded={noticesOpen}
                onClick={() => setNoticePath((current) => (current === pathname ? "" : pathname))}
              >
                <Icon name="bell" />
                <span className={styles.dot} />
              </button>
              {noticesOpen ? (
                <div className={styles.notices}>
                  <NavLink to="/pay/power?account=452190881">
                    <strong>Электричество</strong>
                    <span>Лицевой счёт 452190881 можно оплатить заранее</span>
                  </NavLink>
                  <NavLink to="/go">
                    <strong>Кешбэк 1%</strong>
                    <span>Возвращается при оплате Go в местах-партнёрах</span>
                  </NavLink>
                </div>
              ) : null}
            </div>
            <NavLink to="/profile" className={styles.avatar} aria-label="Профиль">
              {user.initials}
            </NavLink>
          </div>
        </header>
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>

      <nav className={styles.tabs}>
        <Tab to="/" icon="home" label="Главная" end />
        <Tab to="/payments" icon="pay" label="Оплатить" />
        <NavLink to="/go" className={({ isActive }) => `${styles.go} ${isActive ? styles.goOn : ""}`} aria-label="Оплата Go">
          <Icon name="qr" />
        </NavLink>
        <Tab to="/transfer" icon="transfer" label="Перевести" />
        <Tab to="/cards" icon="cards" label="Карты" />
      </nav>
    </div>
  );
}

function SideLink({ to, icon, label, end = false }) {
  return (
    <NavLink to={to} end={end} className={({ isActive }) => `${styles.link} ${isActive ? styles.on : ""}`}>
      <Icon name={icon} />
      {label}
    </NavLink>
  );
}

function Tab({ to, icon, label, end = false }) {
  return (
    <NavLink to={to} end={end} className={({ isActive }) => `${styles.tab} ${isActive ? styles.tabOn : ""}`}>
      <Icon name={icon} size={20} />
      <span>{label}</span>
    </NavLink>
  );
}
