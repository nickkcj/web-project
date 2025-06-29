import { prisma } from '../config/database';

export class LikeService {
  private constructor() {}

  public static async toggleLike(postId: number, userId: number) {
    try {
      const like = await prisma.like.create({
        data: {
          postId,
          userId
        }
      });
      return { action: 'liked' as const, liked: true, like };
    } catch (error: any) {
      // If unique constraint violation (like already exists), delete it
      if (error.code === 'P2002') {
        await prisma.like.delete({
          where: {
            postId_userId: {
              postId,
              userId
            }
          }
        });
        return { action: 'unliked' as const, liked: false };
      }
      throw error;
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
