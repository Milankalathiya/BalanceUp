import React from 'react';
import { Route, BrowserRouter as Router, Routes, Navigate } from 'react-router-dom';
import AdminDashboard from './component/AdminDashboard';
import Login from './component/Login';
import Register from './component/Register';
import UserDashboard from './component/UserDashboard';
import Home from "./component/Home";

const App = () => {
    const isAuthenticated = localStorage.getItem('accessToken');  // Check if user is authenticated

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/user/dashboard" element={<UserDashboard />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Routes>

        </Router>
    );
};

export default App;
