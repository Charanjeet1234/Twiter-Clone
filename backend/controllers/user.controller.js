import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
// API to get user profile
export const getUserProfile = async () =>
{
    const {username} = req.params;

    try {
        const user = await User.fineOne({username}).select("-password")
        if(!user)
        {
            return res.status(400).json({message:"User not found"})
        }
        res.status(200).json(user)
    } catch (error) {
        console.log("Error" , error.message)
        res.status(500).json({error:"Internale Server Error"})
    }
}

// API function to Follow and UnFollow

export const followUnfollowUser = async (req, res) =>
{
    const {id} = req.params;
    const userToModify = await User.findById(id)
    const currentUser = await User.findById(req.user._id) 
    if(id === req.user._id.toString()) 
    {
        return res.status(400).json({error:"You cannot follow/unfollow your self"})
    }
    if(!userToModify || !currentUser) 
    {
        return res.status(400).json({error:"User not found"})
    }

    const isFollowing = currentUser.following.includes(id) 
    if(isFollowing) 
    {
        // unfollow the user
        await User.findByIdAndUpdate(id, {$pull: {followers:req.user._id}})
        await User.findByIdAndUpdate(req.user._id, {$pull: {following:id}})
        res.status(200).json({message:"User unfollowed successfully"})
    }
    else
    {
        // Follow the user
        await User.findByIdAndUpdate(id, {$push: {followers:req.user._id}})
        await User.findByIdAndUpdate(req.user._id, {$push: {following:id}})
        // Send Notification
         const newNotification = new Notification({
            type:"follow",
            from: req.user._id,
            to:userToModify._id,
         })
          await newNotification.save()
        //   Later change send the user id instead of message
        res.status(200).json({message:"User followed successfully"})
        

    }

    try {
        
    } catch (error) {
        
    }
}