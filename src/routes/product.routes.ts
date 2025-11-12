import express from "express";
import { createProduct, getProducts, getSingleProduct } from "../controllers/product.controller";


const router = express.Router();

router.post("/", createProduct);
router.get("/", getProducts);
router.get("/:id", getSingleProduct);

export default router;