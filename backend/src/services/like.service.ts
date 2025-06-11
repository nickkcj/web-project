import { prisma } from '../config/database';

export class LikeService {
  private constructor() {}

  public static async toggleLike(postId: number, userId: number) {
    const existingLike = await prisma.like.findUnique({
      where: {
        postId_userId: {
          postId,
          userId
        }
      }
    });

    if (existingLike) {
      await prisma.like.delete({
        where: {
          postId_userId: {
            postId,
            userId
          }
        }
      });
      return { action: 'unliked' as const, liked: false };
    } else {
      const like = await prisma.like.create({
        data: {
          postId,
          userId
        }
      });
      return { action: 'liked' as const, liked: true, like };
    }
  }

  public static async hasUserLikedReview(postId: number, userId: number): Promise<boolean> {
    const like = await prisma.like.findUnique({
      where: { postId_userId: { postId, userId } }
    });
    return !!like;
  }

  public static async getLikeCount(postId: number): Promise<number> {
    return prisma.like.count({
      where: { postId }
    });
  }
}
