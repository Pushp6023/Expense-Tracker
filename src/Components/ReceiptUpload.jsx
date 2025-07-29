// src/components/ReceiptUpload/ReceiptUpload.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { UploadCloud } from 'lucide-react';

const API_URL = 'http://localhost:5001/api';

const ReceiptUpload = ({ onTransactionAdded }) => {
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setStatus('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setStatus('Please select a file to upload.');
            return;
        }
        const formData = new FormData();
        formData.append('receipt', file);

        try {
            setStatus('1/2: Uploading receipt...');
            // Step 1: Upload the file and get the placeholder data
            const uploadResponse = await axios.post(`${API_URL}/receipt/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const { extractedData } = uploadResponse.data;
            
            setStatus('2/2: Adding transaction...');
            // Step 2: Use the extracted data to create a new transaction
            await axios.post(`${API_URL}/transactions`, {
                description: extractedData.description,
                amount: extractedData.amount,
                type: extractedData.type,
                category: extractedData.category,
                date: extractedData.date
            });

            setStatus('Upload and processing successful!');
            
            // Step 3: Refresh the transaction list to show the new item
            onTransactionAdded(); 
            setFile(null); // Clear the file input

        } catch (err) {
            console.error("Receipt processing failed:", err);
            setStatus('Upload failed. See console for details.');
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
            <h2 className="text-2xl font-bold mb-4 text-slate-900">Upload Receipt</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center justify-center w-full">
                    <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <UploadCloud className="w-8 h-8 mb-4 text-slate-500"/>
                            <p className="mb-2 text-sm text-slate-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-slate-500">PNG, JPG or PDF</p>
                        </div>
                        <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} accept="image/png, image/jpeg, application/pdf"/>
                    </label>
                </div>
                {file && <p className="text-sm text-slate-600">Selected: {file.name}</p>}
                <button type="submit" className="w-full bg-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors">Upload & Process</button>
                {status && <p className="text-sm text-center text-slate-600 mt-2">{status}</p>}
            </form>
        </div>
    );
};

export default ReceiptUpload;
