import express from "express"
import authRoutes from "./routes/auth.routes.js"
import { connectDB } from "./config/db.js";
const app = express()
import dotenv from "dotenv"

dotenv.config()
app.use("/api/auth", authRoutes);
app.get('/', (req, res)=>
{
    res.send("Server is ready")
})



app.listen(8000, () =>
{
    connectDB()
    console.log("App is running at 8000")
})