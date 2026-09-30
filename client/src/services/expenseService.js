import * as api from './api.js';

/**
 * Получение всех расходов с опциональными фильтрами и пагинацией
 * @param {Object} filters - Объект фильтров
 * @param {string} filters.category - Фильтр по категории
 * @param {string} filters.startDate - Начальная дата (YYYY-MM-DD)
 * @param {string} filters.endDate - Конечная дата (YYYY-MM-DD)
 * @param {boolean} filters.isRecurring - Фильтр по признаку регулярности
 * @param {number} filters.page - Номер страницы (по умолчанию 1)
 * @param {number} filters.limit - Количество записей на странице (по умолчанию 20)
 * @returns {Promise<Object>} Объект { data: [...], pagination: {...} }
 */
export const getExpenses = async (filters = {}) => {
  return await api.get('/expenses', filters);
};

/**
 * Получение расхода по ID
 * @param {string} id - Идентификатор расхода
 * @returns {Promise<Object>} Объект { data: {...} }
 */
export const getExpenseById = async (id) => {
  return await api.get(`/expenses/${id}`);
};

/**
 * Добавление нового расхода
 * @param {Object} expenseData - Данные расхода
 * @param {string} expenseData.category - ID категории
 * @param {number} expenseData.amount - Сумма
 * @param {string} expenseData.date - Дата в формате YYYY-MM-DD
 * @param {string} expenseData.comment - Комментарий
 * @param {boolean} expenseData.isRecurring - Признак регулярного расхода
 * @returns {Promise<Object>} Объект { data: {...} }
 */
export const addExpense = async (expenseData) => {
  return await api.post('/expenses', expenseData);
};

/**
 * Обновление существующего расхода
 * @param {string} id - Идентификатор расхода
 * @param {Object} expenseData - Новые данные расхода
 * @returns {Promise<Object>} Объект { data: {...} }
 */
export const updateExpense = async (id, expenseData) => {
  return await api.put(`/expenses/${id}`, expenseData);
};

/**
 * Удаление расхода
 * @param {string} id - Идентификатор расхода
 * @returns {Promise<void>}
 */
export const deleteExpense = async (id) => {
  return await api.del(`/expenses/${id}`);
};