import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Check if the user is already authenticated
        if (localStorage.getItem('accessToken')) {
            // If authenticated, redirect to the dashboard
            navigate('/user/dashboard', { replace: true });  // Or '/admin/dashboard' if user is admin
        }
    }, [navigate]);

    const handleLoginClick = () => {
        navigate('/login', { replace: true });  // Replaces current page in history with Login
    };

    const handleRegisterClick = () => {
        navigate('/register', { replace: true });  // Replaces current page in history with Register
    };

    return (
        <div className="home-container">
            <h2>Welcome to the BalanceUp App!</h2>
            <p>Please log in to access your dashboard.</p>

            {/* Only show login and register buttons if not logged in */}
            {!localStorage.getItem('accessToken') && (
                <div className="button-container">
                    <button className="home-btn" onClick={handleLoginClick}>Login</button>
                    <button className="home-btn" onClick={handleRegisterClick}>Register</button>
                </div>
            )}
        </div>
    );
};

export default Home;
