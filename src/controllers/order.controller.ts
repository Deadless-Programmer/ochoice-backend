// // src/controllers/order.controller.ts
// import { Request, Response } from 'express';
// import * as orderService from '../services/order.service';

// export const buyNow = async (req: Request, res: Response) => {
//   try {
//     const userId = req.body.userId;  // From auth
//     const sellerId = req.body.sellerId;  // Assume sent from frontend (from product)
//     const order = await orderService.createOrder(userId, sellerId);
//     res.status(201).json({ message: 'Order created', order });
//   } catch (error: any) {
//     res.status(500).json({ error: error.message });
//   }
// };

// export const getSellerDashboard = async (req: Request, res: Response) => {
//   try {
//     const sellerId = req.query.sellerId as string;  // From auth
//     const orders = await orderService.getSellerOrders(sellerId);
//     res.json(orders);
//   } catch (error: any) {
//     res.status(500).json({ error: error.message });
//   }
// };

// export const markAsDone = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const order = await orderService.updateOrderStatus(id, 'done');
//     res.json({ message: 'Order marked as done', order });
//   } catch (error: any) {
//     res.status(500).json({ error: error.message });
//   }
// };