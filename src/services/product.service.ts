
import { FilterQuery, SortOrder } from "mongoose";
import Product, { IProduct } from "../models/product.model";

 const createProduct = async (data: IProduct) => {
  return await Product.create(data);
};

// src/services/product.service.ts



export interface GetProductsOptions {
  filters?: FilterQuery<any>;
  sortBy?: "price_asc" | "price_desc" | "newest" | "oldest";
  page?: number;
  limit?: number;
}


// getProductsService.ts
export const getProductsService = async (opts: GetProductsOptions = {}) => {
  const page = Math.max(1, opts.page || 1);
  const limit = Math.min(100, Math.max(1, opts.limit || 20));
  const skip = (page - 1) * limit;

  const sortObj: Record<string, 1 | -1> = { createdAt: -1 }; // default newest

  if (opts.sortBy === "price_asc") {
    sortObj.price = 1;
    delete sortObj.createdAt;
  } else if (opts.sortBy === "price_desc") {
    sortObj.price = -1;
    delete sortObj.createdAt;
  } else if (opts.sortBy === "oldest") {
    sortObj.createdAt = 1;
  }
  // newest = default

  console.log("MongoDB sort object:", sortObj); // ← এটা দেখো!

  const [items, total] = await Promise.all([
    Product.find(opts.filters || {})
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .lean(),
    Product.countDocuments(opts.filters || {}),
  ]);

  return {
    items,
    total,
    page,
    limit,
    pages: total === 0 ? 1 : Math.ceil(total / limit),
  };
};

const getSingleProduct = async (id: string) => {
  return await Product.findById(id);
};

export const productService = {
  createProduct,
  getProductsService,
  getSingleProduct,
};