import { Router } from 'express';
import { MovieController } from '../controllers/movie.controller';

const router = Router();
const movieController = new MovieController();

// Get popular movies
router.get('/popular', movieController.getPopularMovies);

// Search movies
router.get('/search', movieController.searchMovies);

// Get movie details by ID (this should be last since it has a parameter)
router.get('/:id', movieController.getMovieDetails);

export default router; 