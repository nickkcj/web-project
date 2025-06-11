import { Router } from 'express';
import { 
  toggleLike, 
  hasUserLikedReview,
  getLikeCount 
} from '../controllers/like.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Toggle like/unlike for a review (authenticated)
router.post('/:reviewId/toggle', authMiddleware, toggleLike);

// Check if current user has liked a review (authenticated)
router.get('/:reviewId/status', authMiddleware, hasUserLikedReview);

// Get like count for a review (public)
router.get('/:reviewId/count', getLikeCount);

export default router; 