import express from "express";
import { createProduct, deleteProduct, getProducts, getSingleProduct, restoreProduct, updateProduct } from "../controllers/product.controller";
import { authorizeRoles, verifyToken } from "../middleware/verifyToken";


const router = express.Router();

router.post("/", verifyToken,
  authorizeRoles("seller"), createProduct);
router.get("/", getProducts);
router.get("/:id", getSingleProduct);

router.put("/:id", updateProduct);      // full update
router.patch("/:id", updateProduct);    // partial update
router.delete("/:id", deleteProduct);   // soft delete
router.patch("/:id/restore", restoreProduct); // restore

export default router;