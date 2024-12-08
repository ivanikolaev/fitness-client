import React, { useState } from 'react';
import api from '../services/api';

function DeleteWorkout({ workout, onDelete }) {
    const [loading, setLoading] = useState(false); // Для обработки загрузки
    const [error, setError] = useState(null); // Для отображения ошибок

    const handleDeleteWorkout = async (id) => {
        if (!window.confirm('Вы уверены, что хотите удалить эту тренировку?')) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Токен отсутствует. Пожалуйста, войдите в систему.');

            await api.delete(`/workouts/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            onDelete(); // Уведомляем родительский компонент об удалении
        } catch (err) {
            setError(err.message || 'Ошибка при удалении тренировки');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <button onClick={() => handleDeleteWorkout(workout.id)} disabled={loading}>
                {loading ? 'Удаление...' : 'Удалить тренировку'}
            </button>
            {error && <p className="error">{error}</p>} {/* Показываем ошибку, если есть */}
        </div>
    );
}

export default DeleteWorkout;
