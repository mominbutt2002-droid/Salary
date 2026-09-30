import * as api from './api.js';

/**
 * Получение общего баланса (доходы, расходы, разница)
 * @param {string} startDate - Начальная дата фильтра (опционально, YYYY-MM-DD)
 * @param {string} endDate - Конечная дата фильтра (опционально, YYYY-MM-DD)
 * @returns {Promise<Object>} Объект { totalIncome, totalExpense, balance }
 */
export const getBalance = async (startDate, endDate) => {
  const params = {};
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;

  const result = await api.get('/summary', params);
  return result.data;
};

/**
 * Получение сумм по категориям для круговой диаграммы
 * @param {string} type - Тип операции ('income' или 'expense')
 * @param {string} startDate - Начальная дата фильтра (опционально)
 * @param {string} endDate - Конечная дата фильтра (опционально)
 * @returns {Promise<Array>} Массив объектов [{ name, value }] для PieChart
 */
export const getByCategory = async (type = 'expense', startDate, endDate) => {
  const params = { type };
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;

  const result = await api.get('/summary/by-category', params);

  // Маппинг формата бэкенда в формат, ожидаемый PieChart
  return (result.data || []).map((item) => ({
    name: item.categoryLabel,
    value: item.total,
  }));
};

/**
 * Получение помесячной сводки для столбчатого графика
 * @param {number} monthsCount - Количество последних месяцев (по умолчанию 6)
 * @returns {Promise<Array>} Массив объектов [{ month, income, expense }] для BarChart
 */
export const getMonthlySummary = async (monthsCount = 6) => {
  const result = await api.get('/summary/by-month', { months: monthsCount });

  // Маппинг формата бэкенда в формат, ожидаемый BarChart
  // Бэкенд возвращает { year, month (число), income, expense }
  // Компонент ожидает { month (строка-метка), income, expense }
  const monthNames = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];

  return (result.data || []).map((item) => ({
    month: monthNames[item.month - 1] || `М${item.month}`,
    income: item.income,
    expense: item.expense,
  }));
};