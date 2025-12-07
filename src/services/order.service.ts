import Order, { IOrder } from "../models/order.model.js";

class OrderService {
  // CREATE ORDER (Customer Only)
  async createOrder(data: Partial<IOrder>) {
    const order = await Order.create(data);
    return order;
  }

  // GET USER ORDERS (Customer Dashboard)
  async getUserOrders(userId: string) {
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    return orders;
  }

  // GET SELLER ORDERS (Seller Dashboard)
  async getSellerOrders(sellerId: string) {
    // sellerId diye je orders ache, items er moddhe filter
    const orders = await Order.find({ "items.sellerId": sellerId }).sort({
      createdAt: -1,
    });
    return orders;
  }

  // UPDATE ORDER STATUS (Seller Only)
  async updateStatus(orderId: string, status: string) {
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    return updatedOrder;
  }
}

export default new OrderService();
