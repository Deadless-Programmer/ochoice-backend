import express, {  Request, Response  } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import authRoutes from './routes/auth.routes';
import adminRoutes from './routes/admin.routes';




dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Database connect
connectDB();

console.log('✅ App started and middleware registered...');

app.use('/api/auth', authRoutes);
app.use("/api/admin", adminRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('✅ oChoice API is running...');
});

export default app;
