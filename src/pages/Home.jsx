import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { jwtDecode } from "jwt-decode";
import ExerciseSelector from '../components/ExerciseSelector';

const Home = () => {
    const [workouts, setWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newWorkout, setNewWorkout] = useState({
        title: '',
        description: '',
        type: '',
        date: '',
        exercises: [],
    });

    const fetchWorkouts = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Токен отсутствует. Пожалуйста, войдите в систему.');

            const decodedToken = jwtDecode(token);
            const userId = decodedToken.id;

            const response = await api.get(`/workouts?user_id=${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log(userId, response, token)
            setWorkouts(response.data);
        } catch (err) {
            setError(err.message || 'Ошибка при загрузке тренировок');
        } finally {
            setLoading(false);
        }
    };

    const handleAddWorkout = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Токен отсутствует. Пожалуйста, войдите в систему.');

            const decodedToken = jwtDecode(token);
            const userId = decodedToken.id;

            const response = await api.post(
                '/workouts',
                { user_id: userId, ...newWorkout },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setWorkouts([...workouts, response.data]);
            setIsModalOpen(false);
            setNewWorkout({ title: '', description: '', type: '', date: '', exercises: [] });
        } catch (err) {
            setError(err.message || 'Ошибка при добавлении тренировки');
        }
    };

    useEffect(() => {
        fetchWorkouts();
    }, []);

    if (loading) return <p>Загрузка...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h1>Мои тренировки</h1>
            {workouts.length === 0 ? (
                <p>У вас пока нет тренировок</p>
            ) : (
                <ul>
                    {workouts.map((workout) => (
                        <li key={workout.id}>
                            <h2>{workout.title}</h2>
                            <p>{workout.description}</p>
                            <p>Тип: {workout.type}</p>
                            <p>Дата: {workout.date}</p>
                            <p>Упражнения: {workout.exercises}</p>
                        </li>
                    ))}
                </ul>
            )}
            <button onClick={() => setIsModalOpen(true)}>Добавить тренировку</button>
            {isModalOpen && (
                <div style={modalStyle}>
                    <h2>Добавить тренировку</h2>
                    <label>
                        Название:
                        <input
                            type="text"
                            value={newWorkout.title}
                            onChange={(e) => setNewWorkout({ ...newWorkout, title: e.target.value })}
                        />
                    </label>
                    <label>
                        Описание:
                        <textarea
                            value={newWorkout.description}
                            onChange={(e) => setNewWorkout({ ...newWorkout, description: e.target.value })}
                        />
                    </label>
                    <label>
                        Тип:
                        <select
                            value={newWorkout.type}
                            onChange={(e) => setNewWorkout({ ...newWorkout, type: e.target.value })}
                        >
                            <option value="">Выберите тип</option>
                            <option value="cardio">Кардио</option>
                            <option value="strength">Силовая</option>
                            <option value="flexibility">Гибкость</option>
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
                    <button onClick={handleAddWorkout}>Добавить</button>
                    <button onClick={() => setIsModalOpen(false)}>Отмена</button>
                </div>
            )}
        </div>
    );
};

const modalStyle = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: 'white',
    padding: '20px',
    borderRadius: '8px',
    color: 'black',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    zIndex: 1000,
};

export default Home;
