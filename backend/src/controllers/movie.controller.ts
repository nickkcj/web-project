import { Request, Response } from 'express';
import { TMDBService } from '../services/tmdb.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const tmdbService = TMDBService.getInstance();

export class MovieController {
  async getPopularMovies(req: Request, res: Response) {
    try {
      const page = Number(req.query.page) || 1;
      const movies = await tmdbService.getPopularMovies(page);
      res.json(movies);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch popular movies' });
    }
  }

  async getMovieDetails(req: Request, res: Response) {
    try {
      const movieId = Number(req.params.id);
      const movie = await tmdbService.getMovieDetails(movieId);
      res.json(movie);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch movie details' });
    }
  }

  async searchMovies(req: Request, res: Response) {
    try {
      const { query } = req.query;
      const page = Number(req.query.page) || 1;
      
      if (!query) {
        return res.status(400).json({ error: 'Search query is required' });
      }

      const movies = await tmdbService.searchMovies(query as string, page);
      res.json(movies);
    } catch (error) {
      res.status(500).json({ error: 'Failed to search movies' });
    }
  }
} 