import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { ArrowUpCircle, ArrowDownCircle, Trash2, TrendingUp, TrendingDown, DollarSign, UploadCloud } from 'lucide-react';
const API_URL = '/api';

const ExpenseChart = ({ data }) => (
    <div className="mt-8 bg-white p-6 rounded-xl shadow-md border border-slate-200">
        <h2 className="text-2xl font-bold mb-4 text-slate-900">Expenses by Category</h2>
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                {data.length > 0 ? (
                    <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Expenses" fill="#3b82f6" />
                    </BarChart>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-slate-500">No expense data to display for this period.</p>
                    </div>
                )}
            </ResponsiveContainer>
        </div>
    </div>
);
export default ExpenseChart;