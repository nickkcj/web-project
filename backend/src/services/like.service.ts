import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const likeReview = async (postId: number) => {
  return prisma.like.create({
    data: {
      postId
    }
  });
};

export const getLikesByReviewId = async (postId: number) => {
  return prisma.like.findMany({
    where: { postId }
  });
};
