import express from "express";
import { signin, protectedRoute } from "../controllers/authController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/signin", signin);
router.get("/protected", verifyToken, protectedRoute);

export default router;
