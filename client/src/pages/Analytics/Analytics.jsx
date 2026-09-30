import React, { useState, useEffect, useMemo } from 'react';
import { getByCategory, getMonthlySummary, getBalance } from '../../services/summaryService';
import { formatAmount } from '../../utils/formatters';
import PieChart from '../../components/PieChart/PieChart';
import BarChart from '../../components/BarChart/BarChart';
import styles from './Analytics.module.css';

function Analytics() {
  const [period, setPeriod] = useState('month');
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const periods = [
    { id: 'week', label: 'Неделя' },
    { id: 'month', label: 'Месяц' },
    { id: 'quarter', label: 'Квартал' },
    { id: 'year', label: 'Год' },
  ];

  // Определяем количество месяцев для графика в зависимости от периода
  const monthsCount = useMemo(() => {
    switch (period) {
      case 'week':
        return 1;
      case 'month':
        return 1;
      case 'quarter':
        return 3;
      case 'year':
        return 12;
      default:
        return 6;
    }
  }, [period]);

  // Загрузка данных аналитики
  const loadAnalyticsData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Загружаем все три типа данных параллельно
      const [categoryResult, monthlyResult, balanceResult] = await Promise.all([
        getByCategory('expense'),
        getMonthlySummary(monthsCount),
        getBalance(),
      ]);

      setCategoryData(categoryResult || []);
      setMonthlyData(monthlyResult || []);
      setSummary(balanceResult || { totalIncome: 0, totalExpense: 0, balance: 0 });
    } catch (err) {
      console.error('Ошибка при загрузке аналитики:', err);
      setError(err.message || 'Не удалось загрузить данные аналитики');
    } finally {
      setIsLoading(false);
    }
  };

  // Загрузка данных при монтировании и изменении периода
  useEffect(() => {
    loadAnalyticsData();
  }, [monthsCount]);

  // Состояние загрузки
  if (isLoading) {
    return (
      <div className={styles.analytics}>
        <div className={styles.header}>
          <h1 className={styles.title}>Аналитика</h1>
        </div>
        <div className={styles.loading}>Загрузка данных...</div>
      </div>
    );
  }

  return (
    <div className={styles.analytics}>
      <div className={styles.header}>
        <h1 className={styles.title}>Аналитика</h1>
      </div>

      {/* Блок ошибок */}
      {error && (
        <div className={styles.errorBlock}>
          <span className={styles.errorText}>{error}</span>
          <button 
            className={styles.errorButton}
            onClick={loadAnalyticsData}
          >
            Повторить
          </button>
        </div>
      )}

      <div className={styles.periodSelector}>
        {periods.map((p) => (
          <button
            key={p.id}
            className={`${styles.periodButton} ${
              period === p.id ? styles.periodButtonActive : ''
            }`}
            onClick={() => setPeriod(p.id)}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className={styles.chartsGrid}>
        <div className={styles.chartCard}>
          <h2 className={styles.chartTitle}>Расходы по категориям</h2>
          <div className={styles.chartContainer}>
            <PieChart data={categoryData} />
          </div>
        </div>

        <div className={styles.chartCard}>
          <h2 className={styles.chartTitle}>Доходы и расходы по месяцам</h2>
          <div className={styles.chartContainer}>
            <BarChart data={monthlyData} />
          </div>
        </div>
      </div>

      <div className={styles.summarySection}>
        <h2 className={styles.summaryTitle}>Сводка за период</h2>
        <div className={styles.summaryGrid}>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Общие доходы</span>
            <span className={`${styles.summaryValue} ${styles.summaryValueIncome}`}>
              {formatAmount(summary.totalIncome)}
            </span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Общие расходы</span>
            <span className={`${styles.summaryValue} ${styles.summaryValueExpense}`}>
              {formatAmount(summary.totalExpense)}
            </span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Баланс</span>
            <span className={`${styles.summaryValue} ${styles.summaryValueBalance}`}>
              {formatAmount(summary.balance)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;