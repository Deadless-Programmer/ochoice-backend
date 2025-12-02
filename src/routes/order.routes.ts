import { Router } from "express";
import orderController from "../controllers/order.controller";
import { verifyToken, authorizeRoles } from "../middleware/verifyToken";

const router = Router();

router.post("/", verifyToken, orderController.createOrder);

router.get(
  "/user/:userId",
  verifyToken,
  authorizeRoles("customer"),
  orderController.getUserOrders
);

router.get(
  "/seller/:sellerId",
  verifyToken,
  authorizeRoles("seller"),
  orderController.getSellerOrders
);

router.patch(
  "/:orderId/status",
  verifyToken,
  authorizeRoles("seller"),
  orderController.updateStatus
);

export default router;
