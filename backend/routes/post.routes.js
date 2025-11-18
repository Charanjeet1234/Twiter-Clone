import express from "express"
const router = express.Router()
import { protectRoute } from "../middleware/protectRoute.js"
import { createPost, deletePost ,likeUnlikePost,commentOnPost} from "../controllers/post.controller.js"

router.post('/create', protectRoute, createPost)
router.post('/like/:id', protectRoute, likeUnlikePost)
router.post('/comment/:id', protectRoute, commentOnPost)
router.post('/delete', protectRoute, deletePost)

export default router

