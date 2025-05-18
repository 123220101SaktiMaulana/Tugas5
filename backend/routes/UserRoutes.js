import express from "express";
import { getUsers , Register , Login , Logout } from "../controllers/UserController.js";
import { verifyToken } from "../middleware/VerivyToken.js";
import { refreshToken } from "../controllers/RefreshToken.js";

const router = express.Router();

// Route untuk mendapatkan semua user
router.get("/users", verifyToken , getUsers);
router.post("/users", Register);
router.post("/login", Login);
router.get("/token", refreshToken);
router.delete("/logout", Logout);

export default router;