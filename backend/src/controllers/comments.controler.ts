import { Request, Response } from 'express';
import { CreateCommentDto } from '../dtos/comment.dto';
import { CommentsService } from '../services/comments.service';
import { asyncHandler, AppError } from '../middleware/error.middleware';

// Add a comment to a review
export const createComment = asyncHandler(
  async (req: Request, res: Response) => {
    const postId = parseInt(req.params.reviewId, 10);
    const { content } = req.body;
    
    if (isNaN(postId)) {
      throw new AppError('Invalid review ID', 400);
    }
    
    if (!content || content.trim() === '') {
      throw new AppError('Comment content is required', 400);
    }
    
    const commentData: CreateCommentDto = { 
      postId, 
      content,
      userId: req.authUser!.userId
    };
    const comment = await CommentsService.createComment(commentData);
    res.status(201).json(comment);
  }
);

// Get all comments for a review
export const getCommentsByReviewId = asyncHandler(
  async (req: Request, res: Response) => {
    const postId = parseInt(req.params.reviewId, 10);
    
    if (isNaN(postId)) {
      throw new AppError('Invalid review ID', 400);
    }
    
    const comments = await CommentsService.getCommentsByReviewId(postId);
    res.json(comments);
  }
);
