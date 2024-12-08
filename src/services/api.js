import axios from 'axios';

// Настройка базового URL для всех запросов
const instance = axios.create({
    baseURL: 'http://localhost:3000/', // или URL вашего бекенда
    headers: {
        'Content-Type': 'application/json',
    },
});

export default instance;