import mongoose, { Schema, Document } from "mongoose";

export interface IOrder extends Document {
  userId: string;
  items: {
    productId: string;
    sellerId: string;           // NEW
   
    name: string;
    size?: string[];
    imageUrl: string;
    quantity: number;
    price: number;
  }[];
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema = new Schema(
  {
    userId: { 
      type: String, 
      required: true 
    },

    items: [
      {
        productId: { type: String, required: true },

        // NEW FIELDS
        sellerId: { type: String, required: true },
       

        name: { type: String, required: true },
        size: [{ type: String }],
        imageUrl: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],

    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IOrder>("Order", OrderSchema);
