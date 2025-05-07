import * as reviewService from '../services/review.service';
import { Request, Response } from 'express';
import { CreateReviewDto } from '../dtos/review.dto';

export const createReview = async (req: Request, res: Response) => {
  try {
    const reviewData: CreateReviewDto = req.body;
    const review = await reviewService.createReview(reviewData);
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: 'Error creating review' });
  }
};

export const getReviewById = async (req: Request, res: Response) => {
  try {
    const reviewId = parseInt(req.params.id, 10);
    const review = await reviewService.getReviewById(reviewId);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.json(review);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching review' });
  }
};

export const getReviews = async (req: Request, res: Response) => {
  try {
    const reviews = await reviewService.getReviews();
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching reviews' });
  }
};

export const getReviewsByUserId = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    const reviews = await reviewService.getReviewsByUserId(userId);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching reviews by user' });
  }
};

export const getReviewsByMovieId = async (req: Request, res: Response) => {
  try {
    const movieId = req.params.movieId;
    const reviews = await reviewService.getReviewsByMovieId(movieId);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching reviews by movie' });
  }
};
