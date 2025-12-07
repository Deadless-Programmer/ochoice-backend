import { Router } from "express";
import { cartController } from "../controllers/cart.controller";

const router = Router();

// Add to cart
router.post("/add", cartController.add);

// Get user cart
router.get("/:userId", cartController.get);

// Delete a specific cart item
router.delete("/:id", cartController.remove);

router.put("/update/:id", cartController.update);

export default router;
