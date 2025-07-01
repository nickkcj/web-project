import { ReviewService } from '../services/review.service';
import { Request, Response } from 'express';
import { CreateReviewDto, UpdateReviewDto } from '../dtos/review.dto';
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { asyncHandler, AppError } from '../middleware/error.middleware';

export const createReview = asyncHandler(
  async (req: Request, res: Response) => {
    const reviewData: CreateReviewDto = {
      ...req.body,
      userId: req.authUser!.userId,
    };
    const review = await ReviewService.createReview(reviewData);
    res.status(201).json(review);
  }
);

export const getReviewById = asyncHandler(
  async (req: Request, res: Response) => {
    const reviewId = parseInt(req.params.id, 10);

    if (isNaN(reviewId)) {
      throw new AppError('Invalid review ID', 400);
    }

    const review = await ReviewService.getReviewById(reviewId);
    if (!review) {
      throw new AppError('Review not found', 404);
    }
    res.json(review);
  }
);

export const getReviews = asyncHandler(
  async (req: Request, res: Response) => {
    const authUserId = req.authUser!.userId;
    const reviews = await ReviewService.getReviews(authUserId);

    const response = reviews.map((review) => ({
      id: review.id,
      posterUrl:
        'https://image.tmdb.org/t/p/w500' + review.movie?.poster_path || '',
      user: review.User?.name || 'Unknown',
      userId: review.User?.id,
      rating: review.rating,
      text: review.comment,
      time: formatDistanceToNow(new Date(review.createdAt), {
        addSuffix: true,
        locale: ptBR,
      }),
      comments: review.Comment.map((comment) => ({
        id: comment.id,
        user: comment.user?.name || 'Unknown',
        userId: comment.user?.id || 'Unknown',
        text: comment.content,
        time: formatDistanceToNow(new Date(comment.createdAt), {
          addSuffix: true,
          locale: ptBR,
        }),
      })),
    }));

    res.json(response);
  }
);

export const getReviewsByUserId = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId, 10);

    if (isNaN(userId)) {
      throw new AppError('Invalid user ID', 400);
    }

    const authUserId = req.authUser!.userId;
    const reviews = await ReviewService.getReviewsByUserId(userId, authUserId);

    res.json(reviews);
  }
);

export const getReviewsByMovieId = asyncHandler(
  async (req: Request, res: Response) => {
    const movieId = parseInt(req.params.movieId, 10);

    if (isNaN(movieId)) {
      throw new AppError('Invalid movie ID', 400);
    }

    const reviews = await ReviewService.getReviewsByMovieId(movieId);
    res.json(reviews);
  }
);

export const updateReview = asyncHandler(
  async (req: Request, res: Response) => {
    const reviewId = parseInt(req.params.id, 10);

    if (isNaN(reviewId)) {
      throw new AppError('Invalid review ID', 400);
    }

    const reviewData: UpdateReviewDto = req.body;
    const review = await ReviewService.updateReview(reviewId, reviewData);
    res.json(review);
  }
);

export const deleteReview = asyncHandler(
  async (req: Request, res: Response) => {
    const reviewId = parseInt(req.params.id, 10);

    if (isNaN(reviewId)) {
      throw new AppError('Invalid review ID', 400);
    }

    await ReviewService.deleteReview(reviewId);
    res.status(200).json({ message: 'Review deleted successfully' });
  }
);