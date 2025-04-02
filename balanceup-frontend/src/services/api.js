import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api/',
});

// Add JWT token to headers for all requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Function to get user overview
export const getUser Overview = async () => {
    try {
        const response = await api.get('/user/overview'); // Adjust the endpoint as necessary
        return response.data; // Assuming the response contains the overview data
    } catch (error) {
        console.error('Error fetching user overview:', error);
        return { totalIncome: 0, totalExpenses: 0, remainingBudget: 0 }; // Fallback
    }
};

// Function to get user transactions
export const getUser Transactions = async () => {
    try {
        const response = await api.get('/user/transactions'); // Adjust the endpoint as necessary
        return response.data; // Assuming the response contains the transactions
    } catch (error) {
        console.error('Error fetching user transactions:', error);
        return []; // Fallback
    }
};

export default api;