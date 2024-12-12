import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/auth';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const data = await login(formData);
            localStorage.setItem('token', data.token);
            navigate('/');
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Ошибка входа. Проверьте данные и попробуйте снова.';
            setError(errorMessage);
        }
    };

    return (
        <div className="login-container">
            <h1 className="login-title">Вход</h1>
            {error && <p className="login-error">{error}</p>}
            <form className="login-form" onSubmit={handleSubmit}>
                <input
                    className="login-input"
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <input
                    className="login-input"
                    type="password"
                    name="password"
                    placeholder="Пароль"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <button className="login-button" type="submit">Войти</button>
            </form>
            <div className="login-footer">
                <p>Нет аккаунта? <Link to="/register" className="register-link">Зарегистрироваться</Link></p>
            </div>
        </div>
    );
};

export default Login;
