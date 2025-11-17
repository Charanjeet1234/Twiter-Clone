import express from "express"
import authRoutes from "./routes/auth.routes.js"
import userRoutes from "./routes/user.routes.js"
import { connectDB } from "./config/db.js";
import cors from "cors"
const app = express()
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";

dotenv.config()

// config cloudinary
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
});

app.use(cors()) //Allow All Origin
app.use(cookieParser()) //Allow to parse cookies
const PORT = process.env.PORT || 8080

app.use(express.json()) // to parse req.body
app.use(express.urlencoded({extended:true})) // for x-www-form  in postman to parse form data in url coded

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

app.listen(PORT, () =>
{
    connectDB()
    console.log("Server is running at " + `http://localhost:${PORT}`)
})

