import { Request, Response } from "express";
import orderService from "../services/order.service.js";

class OrderController {
  // CREATE ORDER (Customer Only)
  async createOrder(req: Request, res: Response) {
    try {
      const orderData = req.body;
      // userId auth token theke nite parba, na dile frontend theke pathano jabe
      const newOrder = await orderService.createOrder(orderData);
      res.status(201).json({
        success: true,
        message: "Order created successfully!",
        data: newOrder,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // GET USER ORDERS (Customer Dashboard)
  async getUserOrders(req: Request, res: Response) {
    try {
      const userId = req.params.userId;
      const orders = await orderService.getUserOrders(userId);
      res.json({ success: true, data: orders });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // GET SELLER ORDERS (Seller Dashboard)
  async getSellerOrders(req: Request, res: Response) {
    try {
      const sellerId = req.params.sellerId;
      const orders = await orderService.getSellerOrders(sellerId);
      res.json({ success: true, data: orders });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // UPDATE ORDER STATUS (Seller Only)
  async updateStatus(req: Request, res: Response) {
    try {
      const orderId = req.params.orderId;
      const { status } = req.body;

      const updatedOrder = await orderService.updateStatus(orderId, status);

      res.json({
        success: true,
        message: "Order status updated!",
        data: updatedOrder,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

export default new OrderController();
