import { LikeService } from '../services/like.service';
import { Request, Response } from 'express';
import { asyncHandler, AppError } from '../middleware/error.middleware';

// Toggle like/unlike for a review
export const toggleLike = asyncHandler(async (req: Request, res: Response) => {
  const postId = parseInt(req.params.reviewId, 10);
  const userId = req.authUser!.userId;

  if (isNaN(postId)) {
    throw new AppError('Invalid review ID', 400);
  }

  const result = await LikeService.toggleLike(postId, userId);
  res.status(200).json(result);
});

// Get like count for a review
export const getLikeCount = asyncHandler(async (req: Request, res: Response) => {
  const postId = parseInt(req.params.reviewId, 10);
  
  if (isNaN(postId)) {
    throw new AppError('Invalid review ID', 400);
  }

  const count = await LikeService.getLikeCount(postId);
  res.json({ count });
});

export const hasUserLikedReview = asyncHandler(
  async (req: Request, res: Response) => {
    const postId = parseInt(req.params.reviewId, 10);
    const userId = req.authUser!.userId;

    if (isNaN(postId)) {
      throw new AppError('Invalid review ID', 400);
    }

    const hasLiked = await LikeService.hasUserLikedReview(postId, userId);
    res.json({ hasLiked });
  }
);
