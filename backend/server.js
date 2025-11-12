import express from "express"
import authRoutes from "./routes/auth.routes.js"
const app = express()

app.use("/api/auth", authRoutes);
app.get('/', (req, res)=>
{
    res.send("Server is ready")
})



app.listen(8000, () =>
{
    console.log("App is running at 8000")
})