import { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

// Create
export const createPost = async (req: Request, res: Response) => {
  const { content, imageUrl, authorId, categoryId } = req.body;

  try {
    const newPost = await prisma.post.create({
      data: { content, imageUrl, authorId, categoryId },
    });
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: "Gagal membuat post", detail: error });
  }
};

// Read All
export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: { select: { id: true, username: true } },
        comments: true,
      },
      orderBy: { createdAt: "asc" },
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Gagal mengambil postingan" });
  }
};

// Read by ID
export const getPostById = async (req: Request, res: Response) => {
  const postId = parseInt(req.params.id);

  try {
    const post = await prisma.post.findUnique({
      where: { id_post: postId },
      include: {
        author: true,
        category: true,
      },
    });

    if (!post) res.status(404).json({ error: "Post tidak ditemukan" });
    const comments = await prisma.comment.findMany({
      where: {
        postId: postId,
      },
      orderBy: {
        createdAt: "asc", // dari yang paling lama
      },
      take: 2,
      skip: 0,
    });
    const total = await prisma.comment.count({
      where: {
        postId: postId,
      },
    });
    const result = {
      imageUrl: post!.imageUrl,
      content: post!.content,
      author: post!.author.username,
      category: post!.category!.name,
      comments: comments.map((c) => ({
        comment: c.comment,
      })),
      total,
    };

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ error: "Gagal mengambil detail post" });
  }
};

//read by category
export const getPostsByCategory = async (req: Request, res: Response) => {
  const categoryId = parseInt(req.query.category as string);
  const limit = parseInt(req.query.limit as string) || 5;
  const skip = parseInt(req.query.skip as string) || 0;
  try {
    const posts = await prisma.post.findMany({
      where: {
        categoryId: categoryId,
      },
      include: {
        author: true,
        category: true,
        comments: true,
      },
      take: limit,
      skip: skip,
      orderBy: {
        createdAt: "asc",
      },
    });
    const total = await prisma.post.count({
      where: {
        categoryId: categoryId,
      },
    });
    const simplifiedPosts = posts.map((post) => ({
      content: post.content,
      imageUrl: post.imageUrl,
      author: post.author.username,
      category: post.category!.name,
      comments: post.comments.map((c) => ({ comment: c.comment })),
    }));
    res.json({ success: true, total, data: simplifiedPosts });
  } catch (error) {
    console.error("Error filtering posts by category:", error);
    res.status(500).json({ success: false, message: "Failed to fetch posts" });
  }
};

// Update
export const updatePost = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { content, imageUrl, category } = req.body;

  try {
    const updatedPost = await prisma.post.update({
      where: { id_post: Number(id) },
      data: { content, imageUrl, category },
    });
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: "Gagal update post", detail: error });
  }
};

// Delete
export const deletePost = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.post.delete({ where: { id_post: Number(id) } });
    res.json({ message: "Post berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ error: "Gagal hapus post", detail: error });
  }
};
