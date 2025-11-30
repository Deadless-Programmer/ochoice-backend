// // src/models/order.model.ts
// import { Schema, model, Document } from 'mongoose';

// interface IOrder extends Document {
//   userId: string;  // Buyer
//   sellerId: string;  // Seller (fetched from product)
//   items: {
//     productId: string;
//     name: string;
//     price: number;
//     quantity: number;
//     imageUrl: string;
//     altText: string;
//   }[];  // Array of items from cart
//   total: number;
//   status: 'pending' | 'shipped' | 'delivered' | 'done';  // For seller to mark 'done'
//   paymentMethod: 'cash_on_delivery';
// }

// const orderSchema = new Schema<IOrder>({
//   userId: { type: String, required: true },
//   sellerId: { type: String, required: true },
//   items: [{
//     productId: { type: String, required: true },
//     name: { type: String, required: true },
//     price: { type: Number, required: true },
//     quantity: { type: Number, required: true },
//     imageUrl: { type: String, required: true },
//     altText: { type: String, required: true },
//   }],
//   total: { type: Number, required: true },
//   status: { type: String, default: 'pending' },
//   paymentMethod: { type: String, default: 'cash_on_delivery' },
// }, { timestamps: true });

// export const Order = model<IOrder>('Order', orderSchema);