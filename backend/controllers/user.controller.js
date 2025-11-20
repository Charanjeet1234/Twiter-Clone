import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
// Models
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
// API to get user profile
export const getUserProfile = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username }).select("-password");
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.log("Error", error.message);
    res.status(500).json({ error: "Internale Server Error" });
  }
};

// API function to Follow and UnFollow

export const followUnfollowUser = async (req, res) => {
  const { id } = req.params;
  const userToModify = await User.findById(id);
  const currentUser = await User.findById(req.user._id);
  if (id === req.user._id.toString()) {
    return res
      .status(400)
      .json({ error: "You cannot follow/unfollow your self" });
  }
  if (!userToModify || !currentUser) {
    return res.status(400).json({ error: "User not found" });
  }

  const isFollowing = currentUser.following.includes(id);
  if (isFollowing) {
    // unfollow the user
    await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
    await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
    res.status(200).json({ message: "User unfollowed successfully" });
  } else {
    // Follow the user
    await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
    await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
    // Send Notification
    const newNotification = new Notification({
      type: "follow",
      from: req.user._id,
      to: userToModify._id,
    });
    await newNotification.save();
    //   Later change send the user id instead of message
    res.status(200).json({ message: "User followed successfully" });
  }
};

// API function for getSuggestedUsers
export const getSuggestedUsers = async (req, res) => {
  try {
    const userId = req.user._id;

    const userFollowedByMe = await User.findById(userId).select("following");

    const users = await User.aggregate([
      {
        $match: {
          _id: { $ne: userId },
        },
      },
      { $sample: { size: 10 } },
    ]);

    const filteredUsers = users.filter(
      (user) => !userFollowedByMe.following.includes(user._id)
    );
    const suggestUser = filteredUsers.slice(0, 4);
    suggestUser.forEach((user) => (user.password = null));
    res.status(200).json(suggestUser);
  } catch (error) {
    console.log("Error", error.message);
    res.status(500).json({ error: "Internale Server Error" });
  }
};

// API function for updateUserProfile
export const updateUser = async (req, res) => {
  const { fullName, email, username, currentPassword, newPassword, bio, link } =
    req.body;

  let { profileImg, coverImg } = req.body;

  const userId = req.user._id;
  try {
    let user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    if ((!newPassword && currentPassword) || (!currentPassword && newPassword))
      return res
        .status(400)
        .json({
          error: "Please provide both current password and new password",
        });
    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ error: "Current Password does not match" });
      }
      if (newPassword.length < 6) {
        return res
          .status(400)
          .json({
            error:
              "Minimum length of password should be more than 6 characters",
          });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    if (profileImg) {
      // If profileImg already exists and user want to change need to destroy the previous one
      if (user.profileImg) {
        await cloudinary.uploader.destroy(
          user.profileImg.split("/").pop().split("."[0])
        );
      }
      if (user.coverImg) {
        await cloudinary.uploader.destroy(
          user.coverImg.split("/").pop().split("."[0])
        );
      }
      const uploadedResponse = await cloudinary.uploader.upload(profileImg);
      profileImg = uploadedResponse.secure_url;
    }
    if (coverImg) {
      const uploadedResponse = await cloudinary.uploader.update(coverImg);
      coverImg = uploadedResponse.secure_url;
    }

    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.username = username || user.username;
    user.bio = bio || user.bio;
    user.link = link || user.link;
    user.profileImg = profileImg || user.profileImg;
    user.coverImg = coverImg || user.coverImg;

    user = await user.save();
    // password should be null
    user.password = null;
    return res.status(200).json(user);
  } catch (error) {
    console.log("Error", error.message);
    return res.staus(500).json({ message: "Internal Server Error" });
  }
};
