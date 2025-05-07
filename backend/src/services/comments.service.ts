import { PrismaClient } from '@prisma/client';
import { CreateCommentDto } from '../dtos/comment.dto';

const prisma = new PrismaClient();

export const createComment = async (commentData: CreateCommentDto) => {
  return prisma.comment.create({
    data: commentData
  });
};

export const getCommentsByReviewId = async (postId: number) => {
  return prisma.comment.findMany({
    where: { postId }
  });
};
