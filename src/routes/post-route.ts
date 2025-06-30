import express from "express";
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  getPostsByCategory,
} from "../controllers/post-controller";

const router = express.Router();

router.post("/", createPost);
router.get("/", getAllPosts);
router.get("/posts/:id", getPostById);
router.get("/filter", getPostsByCategory);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);

export default router;
