import { Router } from 'express';
import { MovieController } from '../controllers/movie.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { handleValidationErrors } from '../middleware/error.middleware';
import { validateIdParam, validatePaginationQuery, validateSearchQuery } from '../middleware/validation.middleware';

const router = Router();
const movieController = new MovieController();

// Get popular movies
router.get('/popular', validatePaginationQuery, handleValidationErrors, movieController.getPopularMovies);

// Search movies
router.get('/search', validateSearchQuery, validatePaginationQuery, handleValidationErrors, movieController.searchMovies);

router.get('/genre', validatePaginationQuery, handleValidationErrors, movieController.getMoviesByGenre);

router.post('/create', authMiddleware, movieController.createMovie);

// Get movie details by ID (this should be last since it has a parameter)
router.get('/:id', validateIdParam, handleValidationErrors, movieController.getMovieDetails);

export default router;