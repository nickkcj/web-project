import { Router } from 'express';
import { 
  toggleFavorite, 
  hasUserFavorited,
  getUserFavorites,
  getFavoritesByUserId
} from '../controllers/favorite.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { handleValidationErrors } from '../middleware/error.middleware';
import { validateMovieIdParam, validateUserIdParam } from '../middleware/validation.middleware';

const router = Router();

router.use(authMiddleware);

router.post('/:movieId/toggle', validateMovieIdParam, handleValidationErrors, toggleFavorite);

router.get('/', getUserFavorites);

router.get('/:movieId/status', validateMovieIdParam, handleValidationErrors, hasUserFavorited);

router.get('/:userId', validateUserIdParam, handleValidationErrors, getFavoritesByUserId);

export default router;