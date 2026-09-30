// Базовый URL из .env или значение по умолчанию
const BASE_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api/v1` 
  : 'http://localhost:3001/api/v1';

/**
 * Универсальная функция для выполнения HTTP-запросов
 * @param {string} path - Путь относительно BASE_URL
 * @param {Object} options - Опции для fetch
 * @returns {Promise<any>} Распарсенный ответ от сервера
 */
const request = async (path, options = {}) => {
  const url = `${BASE_URL}${path}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const result = await response.json();

    if (!response.ok) {
      // Бэкенд возвращает { error: { code, message } }
      const errorData = result.error || { code: 'UNKNOWN_ERROR', message: 'Неизвестная ошибка сервера' };
      const error = new Error(errorData.message);
      error.code = errorData.code;
      error.status = response.status;
      throw error;
    }

    // Возвращаем весь объект результата (он содержит data и, возможно, pagination)
    return result;
  } catch (error) {
    console.error(`API Error [${options.method || 'GET'} ${path}]:`, error.message);
    throw error;
  }
};

/**
 * GET-запрос с поддержкой query-параметров
 * @param {string} path - Путь
 * @param {Object} params - Объект с query-параметрами
 */
export const get = async (path, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${path}?${queryString}` : path;
  return request(url, { method: 'GET' });
};

/**
 * POST-запрос
 * @param {string} path - Путь
 * @param {Object} body - Тело запроса
 */
export const post = async (path, body) => {
  return request(path, { method: 'POST', body: JSON.stringify(body) });
};

/**
 * PUT-запрос
 * @param {string} path - Путь
 * @param {Object} body - Тело запроса
 */
export const put = async (path, body) => {
  return request(path, { method: 'PUT', body: JSON.stringify(body) });
};

/**
 * DELETE-запрос
 * @param {string} path - Путь
 */
export const del = async (path) => {
  return request(path, { method: 'DELETE' });
};