import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { ArrowUpCircle, ArrowDownCircle, Trash2, TrendingUp, TrendingDown, DollarSign, UploadCloud } from 'lucide-react';
const API_URL = 'http://localhost:5001/api';

const TransactionList = ({ transactions, loading, onTransactionDeleted }) => {
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this transaction?')) {
            try {
                await axios.delete(`${API_URL}/transactions/${id}`);
                onTransactionDeleted();
            } catch (err) {
                alert('Failed to delete transaction.');
            }
        }
    };

    if (loading) return <p className="text-center text-slate-500">Loading transactions...</p>;

    return (
        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 h-full">
            <h2 className="text-2xl font-bold mb-4 text-slate-900">Recent Transactions</h2>
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                {transactions.length > 0 ? (
                    transactions.map(t => (
                        <div key={t.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                            <div className="flex items-center space-x-4">
                                {t.type === 'income' ? <ArrowUpCircle className="h-6 w-6 text-green-500" /> : <ArrowDownCircle className="h-6 w-6 text-red-500" />}
                                <div>
                                    <p className="font-semibold text-slate-800">{t.description}</p>
                                    <p className="text-sm text-slate-500">{format(new Date(t.date), 'MMM dd, yyyy')} - {t.category}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <p className={`font-bold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>{t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}</p>
                                <button onClick={() => handleDelete(t.id)} className="text-slate-400 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-slate-500 text-center py-8">No transactions in this date range.</p>
                )}
            </div>
        </div>
    );
};

export default TransactionList;