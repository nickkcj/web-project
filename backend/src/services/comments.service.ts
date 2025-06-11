import { CreateCommentDto } from '../dtos/comment.dto';
import { prisma } from '../config/database';

export class CommentsService {
  private constructor() {}

  public static async createComment(commentData: CreateCommentDto) {
    return prisma.comment.create({
      data: commentData
    });
  }

  public static async getCommentsByReviewId(postId: number) {
    return prisma.comment.findMany({
      where: { postId }
    });
  }
}
