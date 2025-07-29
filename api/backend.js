import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, {
})
.then(() => console.log("Successfully connected to MongoDB."))
.catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({ storage: storage });

const transactionSchema = new mongoose.Schema({
    description: { type: String, required: true, trim: true },
    amount: { type: Number, required: true },
    type: { type: String, required: true },
    category: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

app.get('/api/transactions', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        
        const query = {};
        if (startDate && endDate) {

            const endOfDay = new Date(endDate);
            endOfDay.setHours(23, 59, 59, 999);

            query.date = {
                $gte: new Date(startDate),
                $lte: endOfDay,
            };
        }

        const transactions = await Transaction.find(query).sort({ date: -1 });
        res.json(transactions);
    } catch (err) {
        console.error("Error fetching transactions:", err);
        res.status(500).json({ message: "Server error while fetching transactions." });
    }
});

// POST /api/transactions - Add a new transaction
app.post('/api/transactions', async (req, res) => {
    try {
        const { description, amount, type, category, date } = req.body;
        if (!description || !amount || !type || !category) {
            return res.status(400).json({ message: "Please provide all required fields." });
        }
        const newTransaction = new Transaction({ description, amount, type, category, date: date || new Date() });
        const savedTransaction = await newTransaction.save();
        res.status(201).json(savedTransaction);
    } catch (err) {
        console.error("Error adding transaction:", err);
        res.status(500).json({ message: "Server error while adding transaction." });
    }
});

// DELETE /api/transactions/:id - Delete a transaction
app.delete('/api/transactions/:id', async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found." });
        }
        await transaction.deleteOne();
        res.json({ message: "Transaction deleted successfully." });
    } catch (err) {
        console.error("Error deleting transaction:", err);
        res.status(500).json({ message: "Server error while deleting transaction." });
    }
});

// POST /api/receipt/upload - Handle receipt upload
app.post('/api/receipt/upload', upload.single('receipt'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }
        
        console.log('Receipt uploaded:', req.file.filename);
        
        res.status(200).json({ 
            message: 'Receipt uploaded successfully. Processing would happen here.',
            filename: req.file.filename,
            extractedData: {
                description: "Extracted from receipt",
                amount: 12.34,
                type: "expense",
                category: "food",
                date: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('Error uploading receipt:', error);
        res.status(500).send('Error uploading file.');
    }
});

app.listen(PORT, () => {
    console.log(`Backend server is running on http://localhost:${PORT}`);
});
