import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { ArrowUpCircle, ArrowDownCircle, Trash2, TrendingUp, TrendingDown, DollarSign, UploadCloud } from 'lucide-react';
import SummaryCards from './Components/SummaryCards';
import TransactionForm from './Components/TransactionForm';
import ReceiptUpload from './Components/ReceiptUpload';
import TransactionList from './Components/TransactionList';
import ExpenseChart from './Components/ExpenseChart';

const API_URL = '/api';

export default function App() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [startDate, setStartDate] = useState(format(startOfMonth(new Date()), 'yyyy-MM-dd'));
    const [endDate, setEndDate] = useState(format(endOfMonth(new Date()), 'yyyy-MM-dd'));

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/transactions`, {
                params: { startDate, endDate }
            });
            console.log("Data received from backend:", response.data); 
            const formattedData = response.data.map(t => ({ ...t, id: t._id }));
            setTransactions(formattedData);
            setError('');
        } catch (err) {
            console.error("Error fetching transactions:", err);
            setError("Could not fetch transactions from the server.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [startDate, endDate]);

    const { totalIncome, totalExpenses, balance, expenseByCategory } = useMemo(() => {
        const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
        const expenses = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
        const expenseByCategory = transactions
            .filter(t => t.type === 'expense')
            .reduce((acc, t) => {
                const categoryLabel = t.category.charAt(0).toUpperCase() + t.category.slice(1);
                acc[categoryLabel] = (acc[categoryLabel] || 0) + t.amount;
                return acc;
            }, {});
        
        const chartData = Object.keys(expenseByCategory).map(key => ({ name: key, Expenses: expenseByCategory[key] }));

        return {
            totalIncome: income,
            totalExpenses: expenses,
            balance: income - expenses,
            expenseByCategory: chartData
        };
    }, [transactions]);

    return (
        <div className="bg-slate-100 min-h-screen font-sans text-slate-800">
            <div className="container mx-auto p-4 md:p-8">
                <header className="mb-8">
                    <h1 className="text-4xl font-bold text-slate-900">Personal Finance Assistant</h1>
                    <p className="text-slate-600 mt-1">A comprehensive dashboard for your financial activities.</p>
                </header>

                {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert"><p>{error}</p></div>}

                <SummaryCards totalIncome={totalIncome} totalExpenses={totalExpenses} balance={balance} />

                <div className="mb-8 p-6 bg-white rounded-xl shadow-md border border-slate-200">
                    <h3 className="text-xl font-bold mb-4 text-slate-900">Filter Transactions by Date</h3>
                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                        <div>
                            <label htmlFor="startDate" className="text-sm font-medium text-slate-600 mr-2">From:</label>
                            <input type="date" id="startDate" value={startDate} onChange={e => setStartDate(e.target.value)} className="p-2 border border-slate-300 rounded-lg"/>
                        </div>
                        <div>
                            <label htmlFor="endDate" className="text-sm font-medium text-slate-600 mr-2">To:</label>
                            <input type="date" id="endDate" value={endDate} onChange={e => setEndDate(e.target.value)} className="p-2 border border-slate-300 rounded-lg"/>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <TransactionForm onTransactionAdded={fetchTransactions} />
                        <ReceiptUpload onTransactionAdded={fetchTransactions} />
                    </div>
                    <div className="lg:col-span-3">
                        <TransactionList transactions={transactions} loading={loading} onTransactionDeleted={fetchTransactions} />
                    </div>
                </div>
                
                <ExpenseChart data={expenseByCategory} />
            </div>
        </div>
    );
}

