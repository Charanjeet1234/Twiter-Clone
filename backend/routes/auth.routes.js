import express from "express"

const router = express.Router()

router.get("/signup",(req,res)=>
{
    res.json({data:"you hit signup Button"})
})

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