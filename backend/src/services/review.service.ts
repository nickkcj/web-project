import { PrismaClient } from '@prisma/client';
import { CreateReviewDto } from '../dtos/review.dto';

const prisma = new PrismaClient();

export const createReview = async (reviewData: CreateReviewDto) => {
  return prisma.review.create({
    data: reviewData
  });
};

export const getReviewById = async (reviewId: number) => {
  return prisma.review.findUnique({
    where: { id: reviewId }
  });
};

export const getReviews = async () => {
  return prisma.review.findMany();
};

export const getReviewsByUserId = async (userId: number) => {
  return prisma.review.findMany({
    where: { userId }
  });
};

export const getReviewsByMovieId = async (movieId: number) => {
  return prisma.review.findMany({
    where: { movieId }
  });
};
