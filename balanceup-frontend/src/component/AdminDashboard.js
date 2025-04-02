import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../App.css';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Fetching the users from the backend
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/admin/users", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,  // Send JWT token for authentication
                    },
                });
                setUsers(response.data);
                setLoading(false);
            } catch (err) {
                setError("Error fetching users");
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // Handle role update
    const handleRoleUpdate = async (userId, newRole) => {
        try {
            await axios.put(
                `http://localhost:8080/api/admin/user/${userId}/role`,
                { role: newRole },  // Ensure the role is sent correctly as an object
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,  // Send JWT token for authentication
                    },
                }
            );
            alert("Role updated successfully!");
            window.location.reload(); // Refresh to reflect role change
        } catch (err) {
            setError("Error updating role");
        }
    };

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem("accessToken");  // Clear stored token
        localStorage.removeItem("refreshToken");
        navigate("/login", { replace: true });  // Redirect to login
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h2>Admin Dashboard</h2>
            <button className="logout-btn" onClick={handleLogout} style={{ float: "right", marginBottom: "10px" }}>
                Logout
            </button>
            {error && <p>{error}</p>}
            <table>
                <thead>
                <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Change Role</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user) => (
                    <tr key={user.id}>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td>
                            <select
                                value={user.role}
                                onChange={(e) => handleRoleUpdate(user.id, e.target.value)}
                            >
                                <option value="USER">User</option>
                                <option value="ADMIN">Admin</option>
                            </select>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminDashboard;
