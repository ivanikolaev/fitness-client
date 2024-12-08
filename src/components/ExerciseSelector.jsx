import React, { useEffect, useState } from 'react';
import api from '../services/api';

const ExerciseSelector = ({ selectedExercises, setSelectedExercises }) => {
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchExercises = async () => {
            try {
                const response = await api.get('/exercises'); // Предполагается эндпоинт для получения упражнений
                setExercises(response.data);
            } catch (err) {
                setError(err.message || 'Ошибка при загрузке упражнений');
            } finally {
                setLoading(false);
            }
        };

        fetchExercises();
    }, []);

    const toggleExercise = (exerciseId) => {
        if (selectedExercises.includes(exerciseId)) {
            setSelectedExercises(selectedExercises.filter((id) => id !== exerciseId));
        } else {
            setSelectedExercises([...selectedExercises, exerciseId]);
        }
    };

    if (loading) return <p>Загрузка списка упражнений...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h3>Выберите упражнения:</h3>
            <ul>
                {exercises.map((exercise) => (
                    <li key={exercise.id}>
                        <label>
                            <input
                                type="checkbox"
                                checked={selectedExercises.includes(exercise.id)}
                                onChange={() => toggleExercise(exercise.id)}
                            />
                            {exercise.name}
                        </label>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ExerciseSelector;
