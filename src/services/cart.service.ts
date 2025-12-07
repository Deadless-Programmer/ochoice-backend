import { Cart } from "../models/cart.model";

export const cartService = {
  // add to cart
  async addToCart(data:any) {
    const { userId, productId, quantity } = data;

    const existing = await Cart.findOne({ userId, productId });

    if (existing) {
      existing.quantity += quantity;
      return existing.save();
    }

    return new Cart(data).save();
  },

  // get items
  async getUserCart(userId: string) {
    return Cart.find({ userId }).sort({ createdAt: -1 });
  },

  // delete
  async deleteCartItem(id: string, userId: string) {
    return Cart.findOneAndDelete({ _id: id, userId });
  },

  // update
  async updateCartItem(id: string, userId: string, updateData:any) {
    return Cart.findOneAndUpdate(
      { _id: id, userId },
      { $set: updateData },
      { new: true }
    );
  }
};
