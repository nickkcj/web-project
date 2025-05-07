import * as likeService from '../services/like.service';
import { Request, Response } from 'express';

// Like a review
export const likeReview = async (req: Request, res: Response) => {
  try {
    const postId = parseInt(req.params.reviewId, 10);
    const like = await likeService.likeReview(postId);
    res.status(201).json(like);
  } catch (error) {
    res.status(500).json({ error: 'Error liking review' });
  }
};

// Get all likes for a review
export const getLikesByReviewId = async (req: Request, res: Response) => {
  try {
    const postId = parseInt(req.params.reviewId, 10);
    const likes = await likeService.getLikesByReviewId(postId);
    res.json(likes);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching likes' });
  }
};
