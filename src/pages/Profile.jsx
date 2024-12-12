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
            setError(err.message || 'Ошибка при загрузке тренировок');
        } finally {
            setLoading(false);
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
                <p>Имя: {name}</p>
                <p>Вес: {weight} кг</p>
                <p>Рост: {height} см</p>
                <button>Редактировать</button>
            </div>
        </>
    )
}

export default Profile