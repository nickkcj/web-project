import { PrismaClient, Visibility } from '@prisma/client';
import { CreateReviewDto } from '../dtos/review.dto';

const prisma = new PrismaClient();

export const createReview = async (reviewData: CreateReviewDto) => {
  return prisma.review.create({
    data: {
      ...reviewData,
      visibility: reviewData.visibility || Visibility.PUBLIC
    }
  });
};

export const getReviewById = async (reviewId: number) => {
  return prisma.review.findUnique({
    where: { id: reviewId }
  });
};

export const getReviews = async () => {
  return prisma.review.findMany({
    where: {
      visibility: Visibility.PUBLIC
    }
  });
};

export const getReviewsByUserId = async (userId: number) => {
  return prisma.review.findMany({
    where: { 
      userId,
      OR: [
        { visibility: Visibility.PUBLIC },
        { userId: userId } // Users can see their own private reviews
      ]
    }
  });
};

export const getReviewsByMovieId = async (movieId: number) => {
  return prisma.review.findMany({
    where: { 
      movieId,
      visibility: Visibility.PUBLIC
    }
  });
};
