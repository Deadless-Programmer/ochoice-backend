import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("MONGO_URI not found");

  if (isConnected) return; // reuse connection

  if (mongoose.connection.readyState >= 1) {
    isConnected = true;
    return;
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      maxPoolSize: 10,
    });
    isConnected = true;
    console.log("🔗 MongoDB Connected (Serverless-safe)");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
  }
};

export default connectDB;



