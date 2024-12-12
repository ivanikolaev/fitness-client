import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import WorkoutInfo from '../components/WorkoutInfo';
import AddWorkout from '../components/AddWorkout';
import Header from '../components/Header';

const Home = () => {
    const [workouts, setWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const fetchWorkouts = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) navigate('/login');

            const decodedToken = jwtDecode(token);
            const userId = decodedToken.id;

            const response = await api.get(`/workouts?user_id=${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setWorkouts(response.data);
        } catch (err) {
            setError(err.message || 'Ошибка при загрузке тренировок');
        } finally {
            setLoading(false);
        }
    };

    const handleAddWorkout = async (newWorkout) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Токен отсутствует. Пожалуйста, войдите в систему.');

            const decodedToken = jwtDecode(token);
            const userId = decodedToken.id;

            const exerciseIds = newWorkout.exercises.map((exercise) => exercise.id);

            await api.post(
                '/workouts',
                { user_id: userId, type: newWorkout.type, date: newWorkout.date, exercises: exerciseIds },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setWorkouts([...workouts, newWorkout]);
            fetchWorkouts();
        } catch (err) {
            setError(err.message || 'Ошибка при добавлении тренировки');
        }
    };

    const handleDeleteWorkout = (deletedWorkoutId) => {
        setWorkouts(workouts.filter((w) => w.id !== deletedWorkoutId));
    };

    useEffect(() => {
        fetchWorkouts();
    }, []);

    if (loading) return <p>Загрузка...</p>;
    if (error) return <p>{error}</p>;

    return (
        <>
            <Header title='Мои тренировки' />
            <div className='workouts'>
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
                    <AddWorkout
                        onAddWorkout={handleAddWorkout}
                        onClose={() => setIsModalOpen(false)}
                    />
                )}
            </div>
        </>
    );
};

export default Home;
