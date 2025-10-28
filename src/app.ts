import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Database connect
connectDB();

app.get('/', (req, res) => {
  res.send('✅ oChoice API is running...');
});

export default app;
