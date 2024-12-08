import React, { useState, useEffect } from 'react';
import api from '../services/api';

const EditWorkout = ({ workout, onClose, onUpdate }) => {
    const [type, setType] = useState('');
    const [date, setDate] = useState('');
    const [exercises, setExercises] = useState([]);

    useEffect(() => {
        if (workout) {
            setType(workout.type);
            setDate(workout.date);
            setExercises(workout.exercises);
        }
    }, [workout]);

    const handleExerciseChange = (index, field, value) => {
        const updatedExercises = [...exercises];
        updatedExercises[index][field] = value;
        setExercises(updatedExercises);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const updatedWorkout = {
                ...workout,
                type,
                date,
                exercises: exercises.map(ex => ({
                    exercise_id: ex.id,
                    weight: ex.weight,
                    repetitions: ex.repetitions
                }))
            };

            // Отправляем обновленные данные на сервер
            const response = await api.put(`/workouts/${workout.id}`, updatedWorkout, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.status === 200) {
                onUpdate(response.data.workout);  // Обновление состояния на родительском компоненте
                onClose();  // Закрываем модальное окно
            }
        } catch (error) {
            console.error('Ошибка при обновлении тренировки:', error);
        }
    };

    return (
        <div className="modal">
            <div className="modal_info modal_edit">
                <h2>Редактировать тренировку</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        Тип тренировки:
                        <input
                            type="text"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                        />
                    </label>
                    <label>
                        Дата:
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </label>
                    <h3>Упражнения</h3>
                    <div className='exercises'>
                        {exercises.map((exercise, index) => (
                            <div key={index}>
                                <label>
                                    {exercise.name}
                                    <div className='exercise'>
                                        <label>Вес:
                                            <input
                                                type="number"
                                                value={exercise.weight}
                                                onChange={(e) => handleExerciseChange(index, 'weight', e.target.value)}
                                            />
                                        </label>
                                        <label>Повторения:
                                            <input
                                                type="number"
                                                value={exercise.repetitions}
                                                onChange={(e) => handleExerciseChange(index, 'repetitions', e.target.value)}
                                            />
                                        </label>
                                    </div>
                                </label>
                            </div>
                        ))}
                    </div>
                    <div className='modal_edit_buttons'>
                        <button type="submit">Сохранить изменения</button>
                        <button className="cancel_button" onClick={onClose}>Закрыть</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditWorkout;
