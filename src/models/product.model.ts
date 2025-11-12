import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  productId: number;
  name: string;
  category: string;
  price: number;
  oldPrice?: number | null;
  image: string;
  label?: string | null;
  colors: string[];
  rating: number;
  reviews: number;
  stock: boolean;
  brand: string;
  size: string[];
  description: string;
  isDeleted?: boolean;
}

const productSchema = new Schema<IProduct>(
  {
    productId: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    oldPrice: { type: Number },
    image: { type: String, required: true },
    label: { type: String },
    colors: { type: [String], required: true },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    stock: { type: Boolean, required: true },
    brand: { type: String, required: true },
    size: { type: [String], required: true },
    description: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Product = mongoose.model<IProduct>("Product", productSchema);
export default Product;
