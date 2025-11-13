import { decode} from "jsonwebtoken";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if(!token)
  {
    return res.status(400).json({error:"Unauthorized - No token provided"})
  }

  const decoded = await jwt.verify(token, process.env.JWT_SECRET)
  if(!decoded)
  {
    return res.status(400).json({error:"Token Expired"})
  }
  const user = await User.findById(decoded.userId).select("-password")
  if(!user)
  {
    return res.status(400).json({error:"No user found"})
  }
  req.user = user;
  next()
    } catch (error) {
         console.log("Error while authorizing", error.message)
         res.status(500).json({error:"Internal Server Error"})
    }
};
