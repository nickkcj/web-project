import { Request, Response } from 'express';
import { FavoriteService } from '../services/favorite.service';

// Toggle favorite/unfavorite for a movie
export const toggleFavorite = async (req: Request, res: Response) => {
  try {
    const movieId = parseInt(req.params.movieId, 10);
    const userId = req.authUser!.userId;

    if (isNaN(movieId)) {
      return res.status(400).json({ error: 'Invalid movie ID' });
    }

    const result = await FavoriteService.toggleFavorite(userId, movieId);
    res.status(200).json(result);
  } catch (error: any) {
    console.error('Error toggling favorite:', error);
    res.status(500).json({ error: 'Error toggling favorite' });
  }
};

// Get user's favorite movies
export const getUserFavorites = async (req: Request, res: Response) => {
  try {
    const userId = req.authUser!.userId;
    const favorites = await FavoriteService.getUserFavorites(userId);
    res.json(favorites);
  } catch (error: any) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ error: 'Error fetching favorites' });
  }
};

// Check if user has favorited a movie
export const hasUserFavorited = async (req: Request, res: Response) => {
  try {
    const movieId = parseInt(req.params.movieId, 10);
    const userId = req.authUser!.userId;

    if (isNaN(movieId)) {
      return res.status(400).json({ error: 'Invalid movie ID' });
    }

    const hasFavorited = await FavoriteService.hasUserFavorited(userId, movieId);
    res.json({ hasFavorited });
  } catch (error: any) {
    console.error('Error checking favorite status:', error);
    res.status(500).json({ error: 'Error checking favorite status' });
  }
};