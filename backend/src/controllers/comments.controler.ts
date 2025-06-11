import { Request, Response } from 'express';
import { CreateCommentDto } from '../dtos/comment.dto';
import { CommentsService } from '../services/comments.service';

// Add a comment to a review
export const createComment = async (req: Request, res: Response) => {
  try {
    const postId = parseInt(req.params.reviewId, 10);
    const { content } = req.body;
    const commentData: CreateCommentDto = { postId, content };
    const comment = await CommentsService.createComment(commentData);
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: 'Error creating comment' });
  }
};

// Get all comments for a review
export const getCommentsByReviewId = async (req: Request, res: Response) => {
  try {
    const postId = parseInt(req.params.reviewId, 10);
    const comments = await CommentsService.getCommentsByReviewId(postId);
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching comments' });
  }
};
