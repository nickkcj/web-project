import { Visibility } from '@prisma/client';
import { CreateReviewDto } from '../dtos/review.dto';
import { prisma } from '../config/database';

export class ReviewService {
  private constructor() {}

  public static async createReview(reviewData: CreateReviewDto) {
    return prisma.review.create({
      data: {
        ...reviewData,
        visibility: reviewData.visibility || Visibility.PUBLIC
      }
    });
  }

  public static async getReviewById(reviewId: number) {
    return prisma.review.findUnique({
      where: { id: reviewId }
    });
  }

  public static async getReviews() {
    return prisma.review.findMany({
      where: {
        visibility: Visibility.PUBLIC
      }
    });
  }

  public static async getReviewsByUserId(userId: number) {
    return prisma.review.findMany({
      where: { 
        userId,
        OR: [
          { visibility: Visibility.PUBLIC },
          { userId: userId } // Users can see their own private reviews
        ]
      }
    });
  }

  public static async getReviewsByMovieId(movieId: number) {
    return prisma.review.findMany({
      where: { 
        movieId,
        visibility: Visibility.PUBLIC
      }
    });
  }
}
