// src/config/db.ts
import mongoose from "mongoose";

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("MONGO_URI not found");

  if (mongoose.connection.readyState >= 1) return;

  return mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000, // 10 sec
    maxPoolSize: 10,
  });
};

export default connectDB;