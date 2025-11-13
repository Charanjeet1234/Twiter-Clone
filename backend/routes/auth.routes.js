import express from "express"
import {getMe, signup , login, logout} from "../controllers/auth.controller.js"
import { protectRoute } from "../middleware/protectRoute.js"
const router = express.Router()

// Middleware authorized user
router.get("/me", protectRoute, getMe)
// For Signup
router.post("/signup", signup)

// For Login
router.post("/login",login)

// For Logout
router.post("/logout", logout)


export default router