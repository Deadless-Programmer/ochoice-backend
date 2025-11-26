import { Request, Response } from "express";
import { productService,getProductsService, restoreProductService, softDeleteProductService, updateProductService } from "../services/product.service";

// Create product
export const createProduct = async (req: Request, res: Response) => {
  try {
   
    const sellerId = (req as any).user?._id;           
    const sellerEmail =(req as any).user?.email;

    if (!sellerId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const productData = {
      ...req.body,
      seller: sellerId,
      sellerEmail: sellerEmail,
    };

    const product = await productService.createProduct(productData);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all products with filters
// src/controllers/product.controller.ts

export const getProducts = async (req: Request, res: Response) => {
  try {
    const {
      category,
      brand,
      size,
      color,
      minPrice,
      maxPrice,
      q,
      sort = "newest",
      page = "1",
      limit = "20",
    } = req.query;
    console.log("Raw req.query:", req.query);
    console.log("Raw color param:", color);
    // Helper: string[] বানানোর জন্য (শুধু trim + filter)
    const toArray = (param: any): string[] => {
      if (!param) return [];
      if (Array.isArray(param)) {
        return param
          .map(String)
          .map((s) => s.trim())
          .filter(Boolean);
      }
      return String(param)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    };

    const filters: any = { isDeleted: false };

    if (category) filters.category = { $in: toArray(category) };
    if (brand) filters.brand = { $in: toArray(brand) };
    if (size) filters.size = { $in: toArray(size) };

    // Color filter — # সহ আছে, তাই কোনো change করবো না
    if (color) {
      const rawColors = toArray(color); // আসবে → ["2f4f4f", "000000"]

      const colorsWithHash = rawColors.map((c) => {
        const clean = c.trim().replace(/^#+/, ""); // যদি # থাকে তাহলে remove
        return "#" + clean; // আবার # যোগ করো
      });

      console.log("Color filter applied:", colorsWithHash);
      filters.colors = { $in: colorsWithHash };
    }

    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.$gte = Number(minPrice);
      if (maxPrice) filters.price.$lte = Number(maxPrice);
    }

    if (q) {
      const term = String(q).trim();
      if (term) {
        filters.$or = [
          { name: { $regex: term, $options: "i" } },
          { description: { $regex: term, $options: "i" } },
          { brand: { $regex: term, $options: "i" } },
        ];
      }
    }

    // Sort fix
    let sortBy: "newest" | "price_asc" | "price_desc" | "oldest" = "newest";
    const sortParam = String(sort || "")
      .trim()
      .toLowerCase();

    if (sortParam === "price_asc") sortBy = "price_asc";
    else if (sortParam === "price_desc") sortBy = "price_desc";
    else if (sortParam === "oldest") sortBy = "oldest";

    console.log("Final sortBy:", sortBy);

    const result = await getProductsService({
      filters,
      sortBy,
      page: parseInt(page as string, 10) || 1,
      limit: parseInt(limit as string, 10) || 20,
    });

    return res.status(200).json({
      success: true,
      data: result.items,
      pagination: {
        total: result.total,
        page: result.page,
        pages: result.pages,
        limit: result.limit,
        hasPrev: result.page > 1,
        hasNext: result.page < result.pages,
      },
    });
  } catch (error: any) {
    console.error("Get Products Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
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


export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = await updateProductService(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};


export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await softDeleteProductService(req.params.id);
    res.status(200).json({
      success: true,
      message: "Product deleted successfully (soft delete)",
      data: product,
    });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const restoreProduct = async (req: Request, res: Response) => {
  try {
    const product = await restoreProductService(req.params.id);
    res.status(200).json({
      success: true,
      message: "Product restored successfully",
      data: product,
    });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};