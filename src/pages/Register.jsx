import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/auth';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        height: '',
        weight: '',
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
            await register(formData);
            navigate('/login');
        } catch (err) {
            setError(err);
        }
    };

    return (
        <div className="login-container">
            <h1 className="login-title">Регистрация</h1>
            {error && <p className="login-error">{error}</p>}
            <form className="login-form" onSubmit={handleSubmit}>
                <input
                    className="login-input"
                    type="text"
                    name="name"
                    placeholder="Имя"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
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
                <input
                    className="login-input"
                    type="number"
                    name="height"
                    placeholder="Рост (см)"
                    value={formData.height}
                    onChange={handleChange}
                    required
                />
                <input
                    className="login-input"
                    type="number"
                    name="weight"
                    placeholder="Вес (кг)"
                    value={formData.weight}
                    onChange={handleChange}
                    required
                />
                <button className="login-button" type="submit">Зарегистрироваться</button>
            </form>
            <div className="login-footer">
                <p>Уже есть аккаунт? <Link to="/login" className="register-link">Войти</Link></p>
            </div>
        </div>
    );
};

export default Register;
