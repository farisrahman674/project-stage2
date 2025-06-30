import { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

// Create
export const createComment = async (req: Request, res: Response) => {
  const { comment, postId, userId } = req.body;

  try {
    const newPost = await prisma.comment.create({
      data: { comment, postId, userId },
    });
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: "Gagal membuat post", detail: error });
  }
};
