import express, { Router } from "express";
import { userSignUp, userLogin, userLogOut } from "../controllers/auth.controller.js";
const router = express.Router();

router.post("/signup", userSignUp);
router.post("/login", userLogin);
router.get("/logout", userLogOut);

export default router;