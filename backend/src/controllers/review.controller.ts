import { ReviewService } from '../services/review.service';
import { Request, Response } from 'express';
import { CreateReviewDto, UpdateReviewDto } from '../dtos/review.dto';
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export const createReview = async (req: Request, res: Response) => {
  try {
    const reviewData: CreateReviewDto = {
      ...req.body,
      userId: req.authUser!.userId
    };
    const review = await ReviewService.createReview(reviewData);
    res.status(201).json(review);
  } catch (error) {
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
  } catch (error) {
    res.status(500).json({ error: 'Error fetching review' });
  }
};

export const getReviews = async (req: Request, res: Response) => {
  try {
    const authUserId = req.authUser!.userId;
    const reviews = await ReviewService.getReviews(authUserId);

    const response = reviews.map((review) => ({
      id: review.id,
      poster: "https://api.themoviedb.org/3" + review.movie?.poster_path || "",
      user: review.User?.name || "Unknown",
      rating: review.rating,
      text: review.comment,
      time: formatDistanceToNow(new Date(review.createdAt), { addSuffix: true, locale: ptBR }),
    }));

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching reviews' });
  }
};

export const getReviewsByUserId = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    const authUserId = req.authUser!.userId;
    const reviews = await ReviewService.getReviewsByUserId(userId, authUserId);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching reviews by user' });
  }
};

export const getReviewsByMovieId = async (req: Request, res: Response) => {
  try {
    const movieId = parseInt(req.params.movieId, 10);
    const reviews = await ReviewService.getReviewsByMovieId(movieId);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching reviews by movie' });
  }
};

export const updateReview = async (req: Request, res: Response) => {
  try {
    const reviewId = parseInt(req.params.id, 10);
    const reviewData: UpdateReviewDto = req.body;
    const review = await ReviewService.updateReview(reviewId, reviewData);
    res.json(review);
  } catch (error) {
    res.status(500).json({ error: 'Error updating review' });
  }
};

export const deleteReview = async (req: Request, res: Response) => {
  try {
    const reviewId = parseInt(req.params.id, 10);
    await ReviewService.deleteReview(reviewId);
    res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
    res.status(500).json({ error: 'Error deleting review' });
  }
};

