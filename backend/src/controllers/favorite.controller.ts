import { Request, Response } from 'express';
import { FavoriteService } from '../services/favorite.service';
import { asyncHandler, AppError } from '../middleware/error.middleware';

export const toggleFavorite = asyncHandler(
  async (req: Request, res: Response) => {
    const movieId = parseInt(req.params.movieId, 10);
    const userId = req.authUser!.userId;

    if (isNaN(movieId)) {
      throw new AppError('Invalid movie ID', 400);
    }

    const result = await FavoriteService.toggleFavorite(userId, movieId);
    res.status(200).json(result);
  }
);

export const getUserFavorites = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.authUser!.userId;
    const favorites = await FavoriteService.getUserFavorites(userId);
    res.json(favorites);
  }
);

export const hasUserFavorited = asyncHandler(
  async (req: Request, res: Response) => {
    const movieId = parseInt(req.params.movieId, 10);
    const userId = req.authUser!.userId;

    if (isNaN(movieId)) {
      throw new AppError('Invalid movie ID', 400);
    }

    const hasFavorited = await FavoriteService.hasUserFavorited(
      userId,
      movieId
    );
    res.json({ hasFavorited });
  }
);