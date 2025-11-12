import express, {  Request, Response  } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import authRoutes from './routes/auth.routes';
import adminRoutes from './routes/admin.routes';
import productRoutes from './routes/product.routes';
import cookieParser from "cookie-parser";



dotenv.config();

const app = express();
app.use(cors({
  origin: "http://localhost:3000", // frontend URL
  credentials: true, // important for cookies
}));
app.use(express.json());
app.use(cookieParser());

// Database connect
connectDB();

console.log('✅ App started and middleware registered...');

app.use('/api/auth', authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('✅ oChoice API is running...');
});

export default app;
