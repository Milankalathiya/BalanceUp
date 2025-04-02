import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../App.css';  // Import CSS file

const Login = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', {
                username,
                password,
            });

            if (response.status === 200 && response.data.accessToken) {
                localStorage.setItem('accessToken', response.data.accessToken);
                localStorage.setItem('refreshToken', response.data.refreshToken);

                const role = response.data.role;
                if (role === 'ADMIN') {
                    navigate('/admin/dashboard', { replace: true });  // Replace the current page with the dashboard
                } else if (role === 'USER') {
                    navigate('/user/dashboard', { replace: true });  // Replace the current page with the user dashboard
                }
            } else {
                setError('Invalid credentials or access denied');
            }
        } catch (err) {
            setError('Error occurred while logging in');
        }
    };




    return (
        <div className="container">
            <h2>Login</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />
                <button type="submit">Login</button>
            </form>
            <p>
                Don't have an account? <a href="/register">Register</a>
            </p>
        </div>
    );
};

export default Login;
