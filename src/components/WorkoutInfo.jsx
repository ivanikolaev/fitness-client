import React, { useState } from 'react';
import EditWorkout from './EditWorkout';
import DeleteWorkout from './DeleteWorkout';

const WorkoutInfo = ({ workout, onUpdate, onDelete }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const totalCalories = workout.exercises.reduce((sum, exercise) => sum + (exercise.calories_burned || 0), 0);
    const formattedDate = new Date(workout.date).toLocaleDateString('ru-RU');

    const handleUpdateWorkout = (updatedWorkout) => {
        onUpdate(updatedWorkout);
        setIsModalOpen(false);
    };

    return (
        <div className="workout_info">
            <h2>Тренировка: {workout.type}</h2>
            <p>Дата: {formattedDate}</p>
            <p>
                Сожжено калорий: <span style={{ color: `${totalCalories < 1000 ? 'darkred' : 'green'}`, fontWeight: 'bold' }}>
                    {totalCalories}
                </span>
            </p>

            <h3>Упражнения:</h3>
            <ul>
                {workout.exercises.map((exercise) => (
                    <li key={exercise.id}>
                        <b>{exercise.name}</b> — вес: {exercise.weight} кг, повторений: {exercise.repetitions}
                    </li>
                ))}
            </ul>
            <div className='workout_buttons'>

                <button onClick={() => setIsModalOpen(true)}>Изменить</button>

                {isModalOpen && (
                    <EditWorkout
                        workout={workout}
                        onClose={() => setIsModalOpen(false)}
                        onUpdate={handleUpdateWorkout}
                    />
                )}

                <DeleteWorkout workout={workout} onDelete={onDelete} />
            </div>
        </div>
    );
};

export default WorkoutInfo;
