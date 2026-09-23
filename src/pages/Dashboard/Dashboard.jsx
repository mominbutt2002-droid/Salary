// src/pages/Dashboard/Dashboard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Dashboard.module.css';

// Временные заглушки для компонентов (будут заменены на импорты позже)
const BalanceCard = ({ title, amount, color }) => (
  <div style={{
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    borderLeft: `4px solid ${color || '#e5e7eb'}`,
  }}>
    <div style={{ color: '#6b7280', marginBottom: '8px' }}>{title}</div>
    <div style={{ fontSize: '24px', fontWeight: '700', color: color || '#111827' }}>
      {amount ?? 0} ₽
    </div>
  </div>
);

const EmptyState = ({ title, description, actionLabel, onAction }) => (
  <div style={{
    textAlign: 'center',
    padding: '40px 20px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
  }}>
    <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
    <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>{title}</div>
    {description && <div style={{ color: '#6b7280', marginBottom: '16px' }}>{description}</div>}
    {actionLabel && (
      <button
        onClick={onAction}
        style={{
          padding: '8px 16px',
          backgroundColor: '#4f46e5',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
        }}
      >
        {actionLabel}
      </button>
    )}
  </div>
);

/**
 * Главная страница приложения с карточками баланса и последними операциями
 */
const Dashboard = () => {
  // Временные данные (будут заменены на реальные данные из сервисов позже)
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [balance, setBalance] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState([]);

  // Обработчик кнопки добавления (пока заглушка)
  const handleAddTransaction = () => {
    console.log('Добавление операции (заглушка)');
  };

  // Обработчик ссылки "Посмотреть все"
  const handleViewAll = () => {
    // Навигация на страницу истории (пока заглушка)
    console.log('Переход к истории (заглушка)');
  };

  return (
    <div className={styles.dashboard}>
      {/* Заголовок страницы и кнопка добавления */}
      <div className={styles.header}>
        <h1 className={styles.title}>Дашборд</h1>
        <button className={styles.addButton} onClick={handleAddTransaction}>
          <span>+</span> Добавить операцию
        </button>
      </div>

      {/* Карточки баланса */}
      <div className={styles.cards}>
        <BalanceCard
          title="Доходы"
          amount={totalIncome}
          color="#10b981"
        />
        <BalanceCard
          title="Расходы"
          amount={totalExpense}
          color="#ef4444"
        />
        <BalanceCard
          title="Баланс"
          amount={balance}
          color="#4f46e5"
        />
      </div>

      {/* Последние операции */}
      <div className={styles.recentSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Последние операции</h2>
          <Link to="/history" className={styles.viewAllLink} onClick={handleViewAll}>
            Посмотреть все →
          </Link>
        </div>

        {recentTransactions?.length > 0 ? (
          <div>Здесь будет список операций</div>
        ) : (
          <EmptyState
            title="Нет операций"
            description="Добавьте свою первую операцию, чтобы начать отслеживать доходы и расходы"
            actionLabel="Добавить операцию"
            onAction={handleAddTransaction}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;