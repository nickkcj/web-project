import { LikeService } from '../services/like.service';
import { Request, Response } from 'express';

// Toggle like/unlike for a review
export const toggleLike = async (req: Request, res: Response) => {
  try {
    const postId = parseInt(req.params.reviewId, 10);
    const userId = req.authUser!.userId;

    if (isNaN(postId)) {
      return res.status(400).json({ error: 'Invalid review ID' });
    }

    const result = await LikeService.toggleLike(postId, userId);
    res.status(200).json(result);
  } catch (error: any) {
    console.error('Error toggling like:', error);
    res.status(500).json({ error: 'Error toggling like' });
  }
};

// Get like count for a review
export const getLikeCount = async (req: Request, res: Response) => {
  try {
    const postId = parseInt(req.params.reviewId, 10);
    
    if (isNaN(postId)) {
      return res.status(400).json({ error: 'Invalid review ID' });
    }

    const count = await LikeService.getLikeCount(postId);
    res.json({ count });
  } catch (error: any) {
    console.error('Error fetching like count:', error);
    res.status(500).json({ error: 'Error fetching like count' });
  }
};

export const hasUserLikedReview = async (req: Request, res: Response) => {
  try {
    const postId = parseInt(req.params.reviewId, 10);
    const userId = req.authUser!.userId;

    if (isNaN(postId)) {
      return res.status(400).json({ error: 'Invalid review ID' });
    }

    const hasLiked = await LikeService.hasUserLikedReview(postId, userId);
    res.json({ hasLiked });
  } catch (error: any) {
    console.error('Error checking like status:', error);
    res.status(500).json({ error: 'Error checking like status' });
  }
};
