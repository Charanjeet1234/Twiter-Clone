import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSendCookie } from "../lib/utils/generateToken.js";
export const signup = async (req, res) => {
  try {
    // console.log("✅ Signup hit:", req.body);
    // res.status(200).json({ message: "Route works fine!" });
    const { fullName, username, email, password } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid Email format" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username is already taken" });
    }
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: "email is already in use" });
    }

    if (password.length < 6) {
      res
        .status(400)
        .json({ error: "Password length should be more than 6 digits" });
    }
    // Hash Passowrd
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      username,
      email,
      password: hashPassword,
    });

    if (newUser) {
      generateTokenAndSendCookie(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        username: newUser.username,
        email: newUser.email,
        followers: newUser.followers,
        following: newUser.following,
        profileImg: newUser.profileImg,
        coverImg: newUser.coverImg,
      });
    } else {
      res.status(400).json({ error: "Invalid User Data" });
    }
  } catch (error) {
    console.log(`Error ${error.message}`);
    res.status(500).json({ error: "Invalid Server Error" });
  }
};

// Login API
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    ); //Need to add || " " else app will crash if the password is empty
    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid username or password" });
    }
    generateTokenAndSendCookie(user._id, res);
    res.status(200).json({
      _id: user._id,
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      followers: user.followers,
      following: user.following,
      profileImg: user.profileImg,
      coverImg: user.coverImg,
    });
  } catch (error) {
    console.log(`error in login controller + ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Logout API

export const logout = async (req, res) => {
  try
  {
      res.cookie("jwt", "", {maxAge:0})
      return res.status(200).json({message:"Logged out Sucessfully"})
  }catch(error)
{
  console.log("Error in logout controller", error.message)
  res.status(500).json({error:"Internal Server Error"})
}};
