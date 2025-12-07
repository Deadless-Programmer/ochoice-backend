import { Request, Response } from "express";
import { cartService } from "../services/cart.service.js";

export const cartController = {
  // Add to cart
  async add(req: Request, res: Response) {
    try {
      const data = req.body;

      const response = await cartService.addToCart({
        userId: data.userId,          
        productId: data.productId,  
        sellerId:data.sellerId,  
        name: data.name,
        price: data.price,
        quantity: data.quantity || 1,
        imageUrl: data.imageUrl,
        size: data.size
      });

      return res.status(201).json({
        success: true,
        message: "Item added to cart",
        data: response,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to add to cart",
      });
    }
  },

  // Get cart
  async get(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      const items = await cartService.getUserCart(userId);

      return res.status(200).json({
        success: true,
        data: items,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch cart",
      });
    }
  },

  // Delete
  async remove(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { userId } = req.body;

      const deleted = await cartService.deleteCartItem(id, userId);

      return res.status(200).json({
        success: true,
        message: "Item removed",
        data: deleted,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to delete cart item",
      });
    }
  },

  // Update (quantity or size)
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { userId, quantity, size } = req.body;

      const updated = await cartService.updateCartItem(id, userId, {
        quantity,
        size,
      });

      return res.status(200).json({
        success: true,
        message: "Cart item updated",
        data: updated,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to update cart item",
      });
    }
  }
};
