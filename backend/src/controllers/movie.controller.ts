import { Request, Response } from 'express';
import { TMDBService } from '../services/tmdb.service';
import { FavoriteService } from '../services/favorite.service';
import { asyncHandler, AppError } from '../middleware/error.middleware';

export class MovieController {
  getPopularMovies = asyncHandler(
    async (req: Request, res: Response) => {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;
      const movies = await TMDBService.getPopularMovies(page, limit);
      res.json(movies);
    }
  );

  getMovieDetails = asyncHandler(
    async (req: Request, res: Response) => {
      const movieId = Number(req.params.id);
      if (isNaN(movieId)) {
        throw new AppError('Invalid movie ID', 400);
      }
      const movie = await TMDBService.getMovieDetails(movieId);
      res.json(movie);
    }
  );

  searchMovies = asyncHandler(
    async (req: Request, res: Response) => {
      const { query } = req.query;
      const page = Number(req.query.page) || 1;

      if (!query) {
        throw new AppError('Search query is required', 400);
      }

      const movies = await TMDBService.searchMovies(query as string, page);
      res.json(movies);
    }
  );

  createMovie = asyncHandler(
    async (req: Request, res: Response) => {
      const movieData = req.body;
      const movie = await FavoriteService.createMovieIfNotExists(movieData);
      res.json(movie);
    }
  );

  getMoviesByGenre = asyncHandler(
    async (req: Request, res: Response) => {
      const genre = Number(req.query.genre);
      if (isNaN(genre)) {
        throw new AppError('Invalid genre ID', 400);
      }
      const movie = await TMDBService.getMoviesByGenre(genre);
      res.json(movie);
    }
  );
}