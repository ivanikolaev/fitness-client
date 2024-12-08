import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { jwtDecode } from "jwt-decode";
import ExerciseSelector from '../components/ExerciseSelector';
import { useNavigate } from 'react-router-dom';
import WorkoutInfo from '../components/WorkoutInfo';

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
    const navigate = useNavigate();

    const fetchWorkouts = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token)
                navigate('/login');

            const decodedToken = jwtDecode(token);
            const userId = decodedToken.id;

            const response = await api.get(`/workouts?user_id=${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log(response.data)
            setWorkouts(response.data);
        } catch (err) {
            setError(err.message || 'Ошибка при загрузке тренировок');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        // Удаляем токен из localStorage
        localStorage.removeItem('token');
        
        // Перенаправляем на страницу логина
        navigate('/login');
    };

    const handleAddWorkout = async () => {
        const { type, date, exercises } = newWorkout;

        // Проверяем, что все поля заполнены
        if (!type || !date || exercises.length === 0) {
            alert('Пожалуйста, заполните все поля перед добавлением тренировки.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Токен отсутствует. Пожалуйста, войдите в систему.');

            const decodedToken = jwtDecode(token);
            const userId = decodedToken.id;

            // Преобразуем упражнения в массив их идентификаторов
            const exerciseIds = exercises.map((exercise) => exercise.id);

            await api.post(
                '/workouts',
                { user_id: userId, type, date, exercises: exerciseIds },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setWorkouts([...workouts, { ...newWorkout }]);
            setIsModalOpen(false);
            setNewWorkout({ title: '', description: '', type: '', date: '', exercises: [] });
        } catch (err) {
            setError(err.message || 'Ошибка при добавлении тренировки');
        }
    };

    const handleDeleteWorkout = (deletedWorkoutId) => {
        setWorkouts(workouts.filter(w => w.id !== deletedWorkoutId));
    };

    useEffect(() => {
        fetchWorkouts();
    }, [newWorkout]);

    if (loading) return <p>Загрузка...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className='workouts'>
            <h1>Мои тренировки</h1>
            <button className='logout' onClick={handleLogout}>Выйти</button>
            {workouts.length === 0 ? (
                <p style={{ marginTop: '20px', fontSize: '20px' }}>У вас пока нет тренировок</p>
            ) : (
                <ul>
                    {workouts.map((workout) => (
                        <div key={workout.id} className='workout'>
                            <WorkoutInfo workout={workout} onUpdate={fetchWorkouts} onDelete={() => handleDeleteWorkout(workout.id)} />
                        </div>
                    ))}
                </ul>
            )}
            <button className='add_workout' onClick={() => setIsModalOpen(true)}>Добавить тренировку</button>
            {isModalOpen && (
                <div className='modal'>
                    <div className='modal_info'>
                        <h2>Добавить тренировку</h2>
                        <label>
                            Тип:
                            <select
                                value={newWorkout.type}
                                onChange={(e) => setNewWorkout({ ...newWorkout, type: e.target.value })}
                            >
                                <option value="">Выберите тип</option>
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
                            <button onClick={handleAddWorkout}>Добавить</button>
                            <button className='modal_cancel' onClick={() => setIsModalOpen(false)}>Отмена</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
