import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

// Routes imports...
import authRoutes from "./routes/auth.routes";
import adminRoutes from "./routes/admin.routes";
import productRoutes from "./routes/product.routes";
import cartRoutes from "./routes/cart.routes";
import orderRoutes from "./routes/order.routes";

dotenv.config();

const app = express();


const allowedOrigins = [
  "http://localhost:3000",
  "https://ochoice-client-web.vercel.app",
  process.env.FRONTEND_URL 
];

app.use(
  cors({
    origin: (origin, callback) => {
     
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, 
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Server is running!" });
});

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

console.log("✅ Express app initialized");

export default app;