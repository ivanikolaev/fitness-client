import React, { useState } from 'react';
import EditWorkout from './EditWorkout';
import DeleteWorkout from './DeleteWorkout';

const WorkoutInfo = ({ workout, onUpdate, onDelete }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const totalCalories = workout.exercises.reduce((sum, exercise) => sum + (exercise.calories_burned || 0), 0);
    const formattedDate = new Date(workout.date).toLocaleDateString('ru-RU');

    // Функция для закрытия модального окна
    const handleCloseModal = () => setIsModalOpen(false);

    // Функция для обновления тренировки в родительском компоненте
    const handleUpdateWorkout = (updatedWorkout) => {
        onUpdate(updatedWorkout); // Передаем обновленную тренировку родительскому компоненту
        setIsModalOpen(false); // Закрываем модальное окно
    };

    return (
        <div className="workout_info">
            <h2>Тренировка: {workout.type}</h2>
            <p>Дата: {formattedDate}</p>
            <p>Сожжено калорий: {totalCalories}</p>

            <h3>Упражнения:</h3>
            <ul>
                {workout.exercises.map((exercise) => (
                    <li key={exercise.id}>
                        {exercise.name} — Вес: {exercise.weight} кг, Повторений: {exercise.repetitions}
                    </li>
                ))}
            </ul>

            <button onClick={() => setIsModalOpen(true)}>Изменить</button>

            {isModalOpen && (
                <EditWorkout
                    workout={workout}
                    onClose={handleCloseModal}
                    onUpdate={handleUpdateWorkout}
                />
            )}

            <DeleteWorkout workout={workout} onDelete={onDelete} />
        </div>
    );
};

export default WorkoutInfo;
