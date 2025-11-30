// // src/services/order.service.ts

// import { Order } from '../models/order.model';
// import { getCartItems, clearCart } from './cart.service';

// export const createOrder = async (userId: string, sellerId: string) => {
//   const cartItems = await getCartItems(userId);
//   if (cartItems.length === 0) throw new Error('Cart is empty');

//   const items = cartItems.map(item => ({
//     productId: item.productId,
//     name: item.name,
//     price: item.price,
//     quantity: item.quantity,
//     imageUrl: item.imageUrl,
//     altText: item.altText,
//   }));

//   const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

//   const newOrder = new Order({ userId, sellerId, items, total });
//   await newOrder.save();

//   // Clear cart after order
//   await clearCart(userId);

//   return newOrder;
// };

// export const getSellerOrders = async (sellerId: string) => {
//   return Order.find({ sellerId });
// };

// export const updateOrderStatus = async (orderId: string, status: 'shipped' | 'delivered' | 'done') => {
//   const order = await Order.findById(orderId);
//   if (!order) throw new Error('Order not found');
//   order.status = status;
//   return order.save();
// };