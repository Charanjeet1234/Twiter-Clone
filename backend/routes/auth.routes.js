import express from "express"
import { signup } from "../controllers/auth.controller.js"
const router = express.Router()

// For Signup
router.get("/signup", signup)


// For Login
router.get("/login",(req,res)=>
{
    res.json({data:"you hit Login Button"})
})

// For Logout
router.get("/logout",(req,res)=>
{
    res.json({data:"you hit Logout Button"})
})


export default router