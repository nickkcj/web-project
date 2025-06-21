import { Router } from 'express';
import { 
  toggleFavorite, 
  hasUserFavorited,
  getUserFavorites 
} from '../controllers/favorite.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Toggle favorite/unfavorite for a movie (authenticated)
router.post('/:movieId/toggle', authMiddleware, toggleFavorite);

// Check if current user has favorited a movie (authenticated)
router.get('/:movieId/status', authMiddleware, hasUserFavorited);

// Get user's favorite movies (authenticated)
router.get('/', authMiddleware, getUserFavorites);

export default router;