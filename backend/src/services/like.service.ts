import { prisma } from '../config/database';

export class LikeService {
  private constructor() {}

  public static async likeReview(postId: number) {
    return prisma.like.create({
      data: {
        postId
      }
    });
  }

  public static async getLikesByReviewId(postId: number) {
    return prisma.like.findMany({
      where: { postId }
    });
  }
}
