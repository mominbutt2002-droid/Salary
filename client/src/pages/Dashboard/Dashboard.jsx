import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import BalanceCard from '../../components/BalanceCard/BalanceCard';
import EmptyState from '../../components/EmptyState/EmptyState';
import TransactionList from '../../components/TransactionList/TransactionList';
import Modal from '../../components/Modal/Modal';
import TransactionForm from '../../components/TransactionForm/TransactionForm';
import styles from './Dashboard.module.css';

function Dashboard() {
  const { 
    incomes, 
    expenses, 
    isLoading, 
    error, 
    clearError,
    addTransaction, 
    deleteTransaction,
    refreshData 
  } = useData();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Вычисляем балансы
  const { totalIncome, totalExpense, balance } = useMemo(() => {
    const income = (incomes || []).reduce((sum, inc) => sum + (inc.amount || 0), 0);
    const expense = (expenses || []).reduce((sum, exp) => sum + (exp.amount || 0), 0);
    return {
      totalIncome: income,
      totalExpense: expense,
      balance: income - expense,
    };
  }, [incomes, expenses]);

  // Последние 5 транзакций
  const recentTransactions = useMemo(() => {
    const allTransactions = [...(incomes || []), ...(expenses || [])];
    return allTransactions
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  }, [incomes, expenses]);

  // Обработчики модалки
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsSubmitting(false);
  };

  // Обработчик добавления транзакции
  const handleSubmit = async (transactionData) => {
    setIsSubmitting(true);
    try {
      await addTransaction(transactionData);
      handleCloseModal();
    } catch (err) {
      console.error('Ошибка при добавлении транзакции:', err);
      // Ошибка уже сохранена в контексте, просто сбрасываем флаг загрузки
      setIsSubmitting(false);
    }
  };

  // Обработчик удаления транзакции
  const handleDelete = async (id) => {
    try {
      // Находим транзакцию, чтобы определить её тип
      const transaction = [...(incomes || []), ...(expenses || [])].find((t) => t.id === id);
      if (transaction) {
        await deleteTransaction(id, transaction.type);
      }
    } catch (err) {
      console.error('Ошибка при удалении транзакции:', err);
      // Ошибка уже сохранена в контексте
    }
  };

  // Состояние загрузки
  if (isLoading) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.loading}>Загрузка данных...</div>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1 className={styles.title}>Обзор</h1>
        <button 
          className={styles.addButton} 
          onClick={handleOpenModal}
          disabled={isSubmitting}
        >
          <span className={styles.addIcon}>+</span>
          Добавить операцию
        </button>
      </div>

      {/* Блок ошибок */}
      {error && (
        <div className={styles.errorBlock}>
          <span className={styles.errorText}>{error}</span>
          <button 
            className={styles.errorButton}
            onClick={() => {
              clearError();
              refreshData();
            }}
          >
            Повторить
          </button>
        </div>
      )}

      <div className={styles.balanceGrid}>
        <BalanceCard
          title="Доходы"
          amount={totalIncome}
          color="income"
        />
        <BalanceCard
          title="Расходы"
          amount={totalExpense}
          color="expense"
        />
        <BalanceCard
          title="Баланс"
          amount={balance}
          color="balance"
        />
      </div>

      <div className={styles.recentSection}>
        <h2 className={styles.sectionTitle}>Последние операции</h2>
        <TransactionList
          transactions={recentTransactions}
          onDelete={handleDelete}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Добавить операцию"
      >
        <TransactionForm
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
          isSubmitting={isSubmitting}
        />
      </Modal>
    </div>
  );
}

export default Dashboard;