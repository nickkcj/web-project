import { Request, Response } from 'express';
import { FavoriteService } from '../services/favorite.service';


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


export const getUserFavorites = async (req: Request, res: Response) => {
  try {
    const userId = req.authUser!.userId;
    const favorites = await FavoriteService.getUserFavorites(userId);
    const favoritesWithUserId = favorites.map((fav: any) => ({ ...fav, userId }));
    res.json(favoritesWithUserId);
  } catch (error: any) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ error: 'Error fetching favorites' });
  }
};

export const getFavoritesByUserId = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.userId);
    const favorites = await FavoriteService.getUserFavorites(userId);
    const favoritesWithUserId = favorites.map((fav) => ({ ...fav, userId }));
    res.json(favoritesWithUserId);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ error: 'Error fetching favorites' });
  }
};

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