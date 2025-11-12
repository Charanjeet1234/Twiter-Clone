import express from "express"
import { signup , login, logout} from "../controllers/auth.controller.js"
const router = express.Router()

// For Signup
router.get("/signup", signup)


// For Login
router.get("/login",login)

// For Logout
router.get("/logout", logout)


export default router