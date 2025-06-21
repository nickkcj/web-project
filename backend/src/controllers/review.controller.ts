import { ReviewService } from '../services/review.service';
import { Request, Response } from 'express';
import { CreateReviewDto, UpdateReviewDto } from '../dtos/review.dto';

export const createReview = async (req: Request, res: Response) => {
  try {
    const reviewData: CreateReviewDto = {
      ...req.body,
      userId: req.authUser!.userId
    };
    const review = await ReviewService.createReview(reviewData);
    res.status(201).json(review);
  } catch (error: any) {
    console.error('Error creating review:', error);
    res.status(500).json({ error: 'Error creating review' });
  }
};

export const getReviewById = async (req: Request, res: Response) => {
  try {
    const reviewId = parseInt(req.params.id, 10);
    const review = await ReviewService.getReviewById(reviewId);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.json(review);
  } catch (error: any) {
    console.error('Error fetching review:', error);
    res.status(500).json({ error: 'Error fetching review' });
  }
};

export const getReviews = async (req: Request, res: Response) => {
  try {
    const authUserId = req.authUser!.userId;
    const reviews = await ReviewService.getReviews(authUserId);
    res.json(reviews);
  } catch (error: any) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Error fetching reviews' });
  }
};

export const getReviewsByUserId = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    // Check if user exists first
    const { UserService } = await import('../services/user.service');
    const user = await UserService.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const authUserId = req.authUser!.userId;
    const reviews = await ReviewService.getReviewsByUserId(userId, authUserId);
    res.json(reviews);
  } catch (error: any) {
    console.error('Error fetching reviews by user:', error);
    res.status(500).json({ error: 'Error fetching reviews by user' });
  }
};

export const getReviewsByMovieId = async (req: Request, res: Response) => {
  try {
    const movieId = parseInt(req.params.movieId, 10);
    
    if (isNaN(movieId)) {
      return res.status(400).json({ error: 'Invalid movie ID' });
    }

    const reviews = await ReviewService.getReviewsByMovieId(movieId);
    res.json(reviews);
  } catch (error: any) {
    console.error('Error fetching reviews by movie:', error);
    res.status(500).json({ error: 'Error fetching reviews by movie' });
  }
};

export const updateReview = async (req: Request, res: Response) => {
  try {
    const reviewId = parseInt(req.params.id, 10);
    
    if (isNaN(reviewId)) {
      return res.status(400).json({ error: 'Invalid review ID' });
    }

    const reviewData: UpdateReviewDto = req.body;
    const review = await ReviewService.updateReview(reviewId, reviewData);
    res.json(review);
  } catch (error: any) {
    console.error('Error updating review:', error);
    res.status(500).json({ error: 'Error updating review' });
  }
};

export const deleteReview = async (req: Request, res: Response) => {
  try {
    const reviewId = parseInt(req.params.id, 10);
    
    if (isNaN(reviewId)) {
      return res.status(400).json({ error: 'Invalid review ID' });
    }

    await ReviewService.deleteReview(reviewId);
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error: any) {
    console.error('Error deleting review:', error);
    res.status(500).json({ error: 'Error deleting review' });
  }
};