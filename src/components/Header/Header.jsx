// src/components/Header/Header.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Header.module.css';

/**
 * Компонент шапки приложения с навигацией
 */
const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Логотип приложения */}
        <NavLink to="/" className={styles.logo}>
          💰 Зарплатный трекер
        </NavLink>

        {/* Навигационное меню */}
        <nav className={styles.nav}>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink
            }
            end
          >
            Главная
          </NavLink>

          <NavLink
            to="/history"
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink
            }
          >
            История
          </NavLink>

          <NavLink
            to="/analytics"
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink
            }
          >
            Аналитика
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Header;