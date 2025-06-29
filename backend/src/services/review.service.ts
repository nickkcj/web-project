import { Visibility } from '../dtos/review.dto';
import { CreateReviewDto, UpdateReviewDto } from '../dtos/review.dto';
import { prisma } from '../config/database';
import { AppError } from '../middleware/error.middleware';

export class ReviewService {
  private constructor() {}

  public static async createReview(reviewData: CreateReviewDto) {
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
  }

  public static async getReviewById(reviewId: number) {
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
  }

  public static async getReviews(authUserId: number) {
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
        },
        Like: true,
        Comment: {
          include: {
            user: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  public static async getReviewsByUserId(userId: number, authUserId: number) {
    // Check if the user exists first
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new AppError(`User with id ${userId} not found`, 404);
    }

    // Check if the user is the one that created the review
    if (userId === authUserId) {
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
  } 

  public static async getReviewsByMovieId(movieId: number) {
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
      }
    });
  }

  public static async updateReview(reviewId: number, reviewData: UpdateReviewDto) {
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
  }

  public static async deleteReview(reviewId: number) {
    return await prisma.review.delete({
      where: { id: reviewId }
    });
  }
}