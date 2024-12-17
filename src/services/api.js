import axios from 'axios';

// Настройка базового URL для всех запросов
const api = axios.create({
    baseURL: 'https://fitness-server-tbwv.onrender.com/', // или URL вашего бекенда
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.response.use(
    (response) => response, // Пропускаем успешные ответы
    (error) => {
        if (error.response && error.response.status === 401) {
            // Если код ошибки 401, перенаправляем на страницу логина
            localStorage.removeItem('token'); // Удаляем старый токен
            window.location.href = '/login'; // Переход на страницу логина
        }
        return Promise.reject(error); // Передаем ошибку дальше
    }
);

export default api;