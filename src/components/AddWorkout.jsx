import React, { useState } from 'react';
import ExerciseSelector from '../components/ExerciseSelector';

const AddWorkout = ({ onAddWorkout, onClose }) => {
    const [newWorkout, setNewWorkout] = useState({
        type: '',
        date: '',
        exercises: [],
    });

    const handleSubmit = () => {
        const { type, date, exercises } = newWorkout;

        if (!type || !date || exercises.length === 0) {
            alert('Пожалуйста, заполните все поля перед добавлением тренировки.');
            return;
        }

        onAddWorkout(newWorkout);
        setNewWorkout({ type: '', date: '', exercises: [] });
        onClose();
    };

    return (
        <div className='modal'>
            <div className='modal_info'>
                <h2>Добавить тренировку</h2>
                <label>
                    Тип тренировки:
                    <select
                        value={newWorkout.type}
                        onChange={(e) => setNewWorkout({ ...newWorkout, type: e.target.value })}
                    >
                        <option value="" disabled>Выберите тип</option>
                        <option value="Кардио">Кардио</option>
                        <option value="Силовая">Силовая</option>
                        <option value="Руки">Руки</option>
                        <option value="Ноги">Ноги</option>
                        <option value="Грудь">Грудь</option>
                        <option value="Спина">Спина</option>
                        <option value="Фулбади">Фулбади</option>
                    </select>
                </label>
                <label>
                    Дата:
                    <input
                        type="date"
                        value={newWorkout.date}
                        onChange={(e) => setNewWorkout({ ...newWorkout, date: e.target.value })}
                    />
                </label>
                <ExerciseSelector
                    selectedExercises={newWorkout.exercises}
                    setSelectedExercises={(exercises) => setNewWorkout({ ...newWorkout, exercises })}
                />
                <div className='modal_buttons'>
                    <button onClick={handleSubmit}>Добавить</button>
                    <button className='modal_cancel' onClick={onClose}>Отмена</button>
                </div>
            </div>
        </div>
    );
};

export default AddWorkout;
