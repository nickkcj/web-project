import { Visibility } from '../dtos/review.dto';
import { CreateReviewDto, UpdateReviewDto } from '../dtos/review.dto';
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

  public static async getReviews(authUserId: number) {

    // Get the ids of the users that the user is following  
    const following = await prisma.userRelationship.findMany({
      where: { followerId: authUserId }
    });
    const followingIds = following.map((follow: { followingId: number }) => follow.followingId);

    // Get all reviews of the users that the user is following or their own private reviews too 
    return prisma.review.findMany({
      where: {
        OR: [
          { visibility: Visibility.PUBLIC },
          { userId: authUserId },
          { userId: { in: followingIds }, visibility: Visibility.PRIVATE }
        ]
      },
      include: {
        User: true,
        movie: true,
        Like: true,
        Comment: {
          include: {
            user: true
          }
        },
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  public static async getReviewsByUserId(userId: number, authUserId: number) {
    // Check if the user is the one that created the review
    if (userId === authUserId) {
      return prisma.review.findMany({
        where: {
          userId
        }
      });
    } 

    const isFollowing = await prisma.userRelationship.findFirst({
      where: {
        followerId: authUserId,
        followingId: userId
      }
    });
    
    if (isFollowing) {
      // User is following the user that created the review, so they can see all reviews  
      return prisma.review.findMany({
        where: {
          userId
        }
      });

    } else {
      // User is not following the target user, so they can only see public reviews
      return prisma.review.findMany({
        where: {
          userId,
          visibility: Visibility.PUBLIC
        }
      });
    }
  } 

  public static async getReviewsByMovieId(movieId: number) {
    return prisma.review.findMany({
      where: { 
        movieId,
        visibility: Visibility.PUBLIC
      }
    });
  }

  public static async updateReview(reviewId: number, reviewData: UpdateReviewDto) {
    return prisma.review.update({
      where: { id: reviewId },
      data: reviewData
    });
  }

  public static async deleteReview(reviewId: number) {
    return prisma.review.delete({
      where: { id: reviewId }
    });
  }
}
