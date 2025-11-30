import express from "express";
import {
  createProduct,
  deleteProduct,
  getDeletedProducts,
  getMyProducts,
  getProducts,
  getSingleProduct,
  restoreProduct,
  updateProduct,
} from "../controllers/product.controller";
import { authorizeRoles, verifyToken } from "../middleware/verifyToken";

const router = express.Router();

router.post("/", verifyToken, authorizeRoles("seller"), createProduct);
router.get("/", getProducts);
router.get(
  "/my-products",
  verifyToken,
  authorizeRoles("seller"),
  getMyProducts
);
router.get("/:id", getSingleProduct);

router.put("/:id", verifyToken, authorizeRoles("seller"), updateProduct); // full update
router.delete("/:id", verifyToken, authorizeRoles("seller"), deleteProduct); // soft delete
router.patch("/:id/restore",verifyToken,authorizeRoles("seller"),restoreProduct); // restore
router.get("/my-products/deleted", verifyToken, authorizeRoles("seller"), getDeletedProducts);

export default router;
