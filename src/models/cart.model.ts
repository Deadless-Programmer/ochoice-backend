import { Schema, model, Document } from 'mongoose';

interface ICartItem extends Document {
  userId: Schema.Types.ObjectId;  
  productId: Schema.Types.ObjectId;  
  sellerId: Schema.Types.ObjectId;
  name: string; 
  price: number;
  quantity: number;
  size: string[];
  imageUrl: string;

}

const cartSchema = new Schema<ICartItem>({
  userId: { 
    type: Schema.Types.ObjectId,  
    ref: 'User',  
    required: true 
  },
  productId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Product',  
    required: true 
  },
  sellerId: { 
    type: Schema.Types.ObjectId, 
     ref: 'User',   
    required: true 
  },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, default: 1 },
    size: { type: [String], required: true },
  imageUrl: { type: String, required: true },
 
  
}, { timestamps: true });

export const Cart = model<ICartItem>('Cart', cartSchema);