import { Visibility } from '../dtos/review.dto';
import { CreateReviewDto, UpdateReviewDto } from '../dtos/review.dto';
import { prisma } from '../config/database';

export class ReviewService {
  private constructor() {}

  public static async createReview(reviewData: CreateReviewDto) {
    try {
      return await prisma.review.create({
        data: {
          ...reviewData,
          visibility: reviewData.visibility || Visibility.PUBLIC
        },
        include: {
          movie: true,
          User: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });
    } catch (error) {
      console.error('Error in createReview:', error);
      throw error;
    }
  }

  public static async getReviewById(reviewId: number) {
    try {
      return await prisma.review.findUnique({
        where: { id: reviewId },
        include: {
          movie: true,
          User: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });
    } catch (error) {
      console.error('Error in getReviewById:', error);
      throw error;
    }
  }

  public static async getReviews(authUserId: number) {
    try {
      // Get the ids of the users that the user is following  
      const following = await prisma.userRelationship.findMany({
        where: { followerId: authUserId }
      });
      const followingIds = following.map((follow: { followingId: number }) => follow.followingId);

      // Get all reviews of the users that the user is following or their own private reviews too 
      return await prisma.review.findMany({
        where: {
          OR: [
            { visibility: Visibility.PUBLIC },
            { userId: authUserId },
            { userId: { in: followingIds }, visibility: Visibility.PRIVATE }
          ]
        },
        include: {
          movie: true,
          User: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    } catch (error) {
      console.error('Error in getReviews:', error);
      throw error;
    }
  }

  public static async getReviewsByUserId(userId: number, authUserId: number) {
    try {
      console.log(`Getting reviews for user ${userId}, requested by ${authUserId}`);

      // Check if the user exists first
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        throw new Error(`User with id ${userId} not found`);
      }

      // Check if the user is the one that created the review
      if (userId === authUserId) {
        console.log('User is viewing their own reviews');
        return await prisma.review.findMany({
          where: {
            userId
          },
          include: {
            movie: true,
            User: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
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
        console.log('User is following the target user');
        // User is following the user that created the review, so they can see all reviews  
        return await prisma.review.findMany({
          where: {
            userId
          },
          include: {
            movie: true,
            User: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        });

      } else {
        console.log('User is not following the target user, showing only public reviews');
        // User is not following the target user, so they can only see public reviews
        return await prisma.review.findMany({
          where: {
            userId,
            visibility: Visibility.PUBLIC
          },
          include: {
            movie: true,
            User: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        });
      }
    } catch (error) {
      console.error('Error in getReviewsByUserId:', error);
      throw error;
    }
  } 

  public static async getReviewsByMovieId(movieId: number) {
    try {
      return await prisma.review.findMany({
        where: { 
          movieId,
          visibility: Visibility.PUBLIC
        },
        include: {
          movie: true,
          User: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    } catch (error) {
      console.error('Error in getReviewsByMovieId:', error);
      throw error;
    }
  }

  public static async updateReview(reviewId: number, reviewData: UpdateReviewDto) {
    try {
      return await prisma.review.update({
        where: { id: reviewId },
        data: reviewData,
        include: {
          movie: true,
          User: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });
    } catch (error) {
      console.error('Error in updateReview:', error);
      throw error;
    }
  }

  public static async deleteReview(reviewId: number) {
    try {
      return await prisma.review.delete({
        where: { id: reviewId }
      });
    } catch (error) {
      console.error('Error in deleteReview:', error);
      throw error;
    }
  }
}