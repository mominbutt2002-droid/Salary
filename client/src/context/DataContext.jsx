import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getIncomes, addIncome, updateIncome, deleteIncome } from '../services/incomeService';
import { getExpenses, addExpense, updateExpense, deleteExpense } from '../services/expenseService';

// Контекст для данных
const DataContext = createContext(null);

/**
 * Хук для использования контекста данных
 * @returns {Object} Объект с данными и методами управления
 */
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};

/**
 * Провайдер контекста данных
 */
export const DataProvider = ({ children }) => {
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Загрузка данных при монтировании
  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // API возвращает { data: [...], pagination: {...} }
      const [incomesResult, expensesResult] = await Promise.all([
        getIncomes(),
        getExpenses(),
      ]);

      // Явно добавляем поле type, так как бэкенд его не возвращает, 
      // а оно критически важно для корректного обновления и удаления
      const typedIncomes = (incomesResult.data || []).map(item => ({ ...item, type: 'income' }));
      const typedExpenses = (expensesResult.data || []).map(item => ({ ...item, type: 'expense' }));

      setIncomes(typedIncomes);
      setExpenses(typedExpenses);
    } catch (err) {
      console.error('Ошибка при загрузке данных:', err);
      setError(err.message || 'Не удалось загрузить данные');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Методы для доходов
  const handleAddIncome = async (incomeData) => {
    try {
      const result = await addIncome(incomeData);
      const newIncome = { ...result.data, type: 'income' }; // Добавляем type
      setIncomes((prev) => [...prev, newIncome]);
      return newIncome;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const handleUpdateIncome = async (id, incomeData) => {
    try {
      const result = await updateIncome(id, incomeData);
      const updatedIncome = { ...result.data, type: 'income' }; // Добавляем type
      setIncomes((prev) => prev.map((inc) => (inc.id === id ? updatedIncome : inc)));
      return updatedIncome;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const handleDeleteIncome = async (id) => {
    try {
      await deleteIncome(id);
      setIncomes((prev) => prev.filter((inc) => inc.id !== id));
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Методы для расходов
  const handleAddExpense = async (expenseData) => {
    try {
      const result = await addExpense(expenseData);
      const newExpense = { ...result.data, type: 'expense' }; // Добавляем type
      setExpenses((prev) => [...prev, newExpense]);
      return newExpense;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const handleUpdateExpense = async (id, expenseData) => {
    try {
      const result = await updateExpense(id, expenseData);
      const updatedExpense = { ...result.data, type: 'expense' }; // Добавляем type
      setExpenses((prev) => prev.map((exp) => (exp.id === id ? updatedExpense : exp)));
      return updatedExpense;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      await deleteExpense(id);
      setExpenses((prev) => prev.filter((exp) => exp.id !== id));
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Универсальный метод добавления транзакции
  const addTransaction = async (transactionData) => {
    if (transactionData.type === 'income') {
      return await handleAddIncome(transactionData);
    } else {
      return await handleAddExpense(transactionData);
    }
  };

  // Универсальный метод обновления транзакции
  const updateTransaction = async (id, transactionData) => {
    if (transactionData.type === 'income') {
      return await handleUpdateIncome(id, transactionData);
    } else {
      return await handleUpdateExpense(id, transactionData);
    }
  };

  // Универсальный метод удаления транзакции
  const deleteTransaction = async (id, type) => {
    if (type === 'income') {
      return await handleDeleteIncome(id);
    } else {
      return await handleDeleteExpense(id);
    }
  };

  // Метод очистки ошибки
  const clearError = () => setError(null);

  const value = {
    incomes,
    expenses,
    isLoading,
    error,
    clearError,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    refreshData: loadData,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};