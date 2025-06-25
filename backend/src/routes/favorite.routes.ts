import { Router } from 'express';
import { 
  toggleFavorite, 
  hasUserFavorited,
  getUserFavorites 
} from '../controllers/favorite.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();


router.post('/:movieId/toggle', authMiddleware, toggleFavorite);


router.get('/:movieId/status', authMiddleware, hasUserFavorited);


router.get('/', authMiddleware, getUserFavorites);

export default router;