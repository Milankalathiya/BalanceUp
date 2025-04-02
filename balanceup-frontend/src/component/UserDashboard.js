// src/component/UserDashboard.js
import React, { useEffect, useState } from 'react';
// import { getUser Overview, getUser Transactions } from '../service/api'; // Import the new functions

const UserDashboard = () => {
    const [transactions, setTransactions] = useState([]);
    const [overview, setOverview] = useState({ totalIncome: 0, totalExpenses: 0, remainingBudget: 0 });

    // useEffect(() => {
    //     fetchUser Overview();
    //     fetchUser Transactions();
    // }, []);

    // const fetchUser Overview = async () => {
    //     const data = await getUser Overview(); // Fetch user overview data
    //     setOverview(data);
    // };
    //
    // const fetchUser Transactions = async () => {
    //     const data = await getUser Transactions(); // Fetch user transactions
    //     setTransactions(data);
    // };

    return (
        <div>
            <h1>User Dashboard</h1>
            <div>
                <h2>Financial Overview</h2>
                <p>Total Income: {overview.totalIncome}</p>
                <p>Total Expenses: {overview.totalExpenses}</p>
                <p>Remaining Budget: {overview.remainingBudget}</p>
            </div>
            <div>
                <h2>Recent Transactions</h2>
                <ul>
                    {transactions.map(transaction => (
                        <li key={transaction.id}>
                            {transaction.description}: {transaction.amount}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default UserDashboard;