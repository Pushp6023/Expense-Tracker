import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { ArrowUpCircle, ArrowDownCircle, Trash2, TrendingUp, TrendingDown, DollarSign, UploadCloud } from 'lucide-react';
const API_URL = '/api';

const TransactionForm = ({ onTransactionAdded }) => {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('food');
    const [transactionType, setTransactionType] = useState('expense');
    const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!description || !amount) {
            setError('Please enter a description and amount.');
            return;
        }
        try {
            await axios.post(`${API_URL}/transactions`, {
                description,
                amount: parseFloat(amount),
                type: transactionType,
                category: transactionType === 'expense' ? category : 'income',
                date
            });
            onTransactionAdded();
            setDescription(''); 
            setAmount(''); 
            setCategory('food'); 
            setError(''); 
            setDate(format(new Date(), 'yyyy-MM-dd'));
        } catch (err) {
            console.error("Error details:", err); 
            
            setError('Failed to add transaction.');
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
            <h2 className="text-2xl font-bold mb-4 text-slate-900">Add Transaction</h2>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex space-x-2">
                    <button type="button" onClick={() => setTransactionType('expense')} className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${transactionType === 'expense' ? 'bg-red-500 text-white shadow-sm' : 'bg-slate-100 hover:bg-slate-200'}`}>Expense</button>
                    <button type="button" onClick={() => setTransactionType('income')} className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${transactionType === 'income' ? 'bg-green-500 text-white shadow-sm' : 'bg-slate-100 hover:bg-slate-200'}`}>Income</button>
                </div>
                <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" className="w-full p-2 border border-slate-300 rounded-lg"/>
                <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount" className="w-full p-2 border border-slate-300 rounded-lg"/>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg"/>
                {transactionType === 'expense' && (
                    <select value={category} onChange={e => setCategory(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg bg-white">
                        <option value="food">Food</option>
                        <option value="transport">Transport</option>
                        <option value="bills">Bills</option>
                        <option value="shopping">Shopping</option>
                        <option value="other">Other</option>
                    </select>
                )}
                <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors">Add Transaction</button>
            </form>
        </div>
    );
};

export default TransactionForm;