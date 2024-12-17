import React, { useState } from 'react';
import api from '../services/api';

function DeleteWorkout({ workout, onDelete }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleDeleteWorkout = async (id) => {
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Токен отсутствует. Пожалуйста, войдите в систему.');

            await api.delete(`/workouts/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            onDelete();
        } catch (err) {
            setError(err.message || 'Ошибка при удалении тренировки');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <button className="delete_button" onClick={() => handleDeleteWorkout(workout.id)} disabled={loading}>
                {loading ? 'Удаление...' : 'Удалить'}
            </button>
            {error && <p className="error">{error}</p>}
        </div>
    );
}

export default DeleteWorkout;
