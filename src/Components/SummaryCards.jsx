import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { ArrowUpCircle, ArrowDownCircle, Trash2, TrendingUp, TrendingDown, DollarSign, UploadCloud } from 'lucide-react';

const SummaryCards = ({ totalIncome, totalExpenses, balance }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 flex items-center space-x-4">
            <div className="bg-green-100 p-3 rounded-full"><TrendingUp className="h-7 w-7 text-green-600" /></div>
            <div>
                <p className="text-slate-500">Total Income</p>
                <p className="text-3xl font-semibold text-slate-900">${totalIncome.toFixed(2)}</p>
            </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 flex items-center space-x-4">
            <div className="bg-red-100 p-3 rounded-full"><TrendingDown className="h-7 w-7 text-red-600" /></div>
            <div>
                <p className="text-slate-500">Total Expenses</p>
                <p className="text-3xl font-semibold text-slate-900">${totalExpenses.toFixed(2)}</p>
            </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-full"><DollarSign className="h-7 w-7 text-blue-600" /></div>
            <div>
                <p className="text-slate-500">Net Balance</p>
                <p className={`text-3xl font-semibold ${balance >= 0 ? 'text-slate-900' : 'text-red-600'}`}>${balance.toFixed(2)}</p>
            </div>
        </div>
    </div>
);
export default SummaryCards;