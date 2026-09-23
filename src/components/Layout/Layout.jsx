// src/components/Layout/Layout.jsx
import React from 'react';
import Header from '../Header/Header';
import styles from './Layout.module.css';

/**
 * Обёртка приложения: шапка + основной контент
 */
const Layout = ({ children }) => {
  return (
    <div className={styles.wrapper}>
      {/* Шапка приложения */}
      <Header />

      {/* Основной контент */}
      <main className={styles.main}>
        <div className={styles.content}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
