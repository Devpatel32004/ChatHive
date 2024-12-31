import express from "express";
import { checkAuth, loginUser, logoutUser, signUpUser, updateProfile } from "../controllers/authController.js";
import { protectRoute } from "../middlewares/authMiddleware.js";

const router =  express.Router()

router.post("/signup", signUpUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

router.put("/update-profile",protectRoute, updateProfile);

router.get("/check", protectRoute, checkAuth);

export default router