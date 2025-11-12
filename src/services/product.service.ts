
import { FilterQuery, SortOrder } from "mongoose";
import Product, { IProduct } from "../models/product.model";

 const createProduct = async (data: IProduct) => {
  return await Product.create(data);
};

 const getProducts = async (
  filters: FilterQuery<any> = {},
  sort: Record<string, SortOrder> = {}
) => {
  return await Product.find(filters).sort(sort);
};

const getSingleProduct = async (id: string) => {
  return await Product.findById(id);
};

export const productService = {
  createProduct,
  getProducts,
  getSingleProduct,
};