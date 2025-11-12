import { Request, Response } from "express";
import {productService} from "../services/product.service";

// Create product
export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json({message: "Product create successfully",  success: true, data: product });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all products with filters
export const getProducts = async (req: Request, res: Response) => {
  try {
    const { category, size, color, brand, minPrice, maxPrice, sort } =
      req.query;

    const filters: any = {};

    if (category) filters.category = category;
    if (brand) filters.brand = brand;
    if (color) filters.colors = { $in: [color] };
    if (size) filters.size = { $in: [size] };
    if (minPrice || maxPrice)
      filters.price = {
        ...(minPrice ? { $gte: Number(minPrice) } : {}),
        ...(maxPrice ? { $lte: Number(maxPrice) } : {}),
      };

    const sortOptions: any = {};
    if (sort === "price_asc") sortOptions.price = 1;
    else if (sort === "price_desc") sortOptions.price = -1;
    else if (sort === "newest") sortOptions.createdAt = -1;

    const products = await productService.getProducts(filters, sortOptions);

    res.status(200).json({ success: true, count: products.length, data: products });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single product
export const getSingleProduct = async (req: Request, res: Response) => {
  try {
    const product = await productService.getSingleProduct(req.params.id);
    res.status(200).json({ success: true, data: product });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
