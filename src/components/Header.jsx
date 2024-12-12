import React from 'react'
import { useNavigate } from 'react-router-dom'

const Header = ({ title }) => {
    const navigate = useNavigate();

    return (
        <header>
            <h1 className='header_title'>{title}</h1>
            <button onClick={() => navigate('/')}>Тренировки</button>
            <button onClick={() => navigate('/goals')}>Цели</button>
            <button onClick={() => navigate('/profile')}>Профиль</button>
            <button className='logout' onClick={() => localStorage.removeItem('token') || navigate('/login')}>Выйти</button>
        </header>
    )
}

export default Header