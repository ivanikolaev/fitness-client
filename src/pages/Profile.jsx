import React from 'react'
import Header from '../components/Header'
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../services/api';
import { jwtDecode } from "jwt-decode";

const Profile = () => {
    const [name, setName] = useState('');
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) navigate('/login');

            const decodedToken = jwtDecode(token);
            const userId = decodedToken.id;

            const response = await api.get(`/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setName(response.data.name);
            setWeight(response.data.weight);
            setHeight(response.data.height);
        } catch (err) {
            setError(err.message || 'Ошибка при загрузке профиля');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');

            const userId = jwtDecode(token).id;
            const email = jwtDecode(token).email;

            await api.put(`/users/${userId}`, { name, email, weight, height }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsModalOpen(false);
            fetchProfile();
        } catch (err) {
            setError(err.message || 'Ошибка при обновлении профиля');
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    if (loading) return <p>Загрузка...</p>;
    if (error) return <p>{error}</p>;

    return (
        <>
            <Header title='Мой профиль' />
            <div className="profile-container">
                <p><b>Имя:</b> {name}</p>
                <p><b>Вес:</b> {weight} кг</p>
                <p><b>Рост:</b> {height} см</p>
                <button className='login-button' onClick={() => setIsModalOpen(true)}>Редактировать</button>
            </div>
            {isModalOpen && (
                <div className="modal">
                    <div className="modal_info modal_edit modal_profile">
                        <h2>Редактировать профиль</h2>
                        <form onSubmit={handleSubmit}>
                            <label>
                                Имя:
                                <input value={name} onChange={(e) => setName(e.target.value)} />
                            </label>
                            <label>Вес:
                                <input type='number' value={weight} onChange={(e) => setWeight(e.target.value)} />
                            </label>
                            <label>
                                Рост:
                                <input type='number' value={height} onChange={(e) => setHeight(e.target.value)} />
                            </label>
                            <div className="modal_buttons">
                                <button type="submit">Сохранить</button>
                                <button className='modal_cancel' onClick={() => setIsModalOpen(false)}>Отмена</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}

export default Profile