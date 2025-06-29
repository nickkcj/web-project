import { Router } from 'express';
import { 
  toggleLike, 
  hasUserLikedReview,
  getLikeCount 
} from '../controllers/like.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { handleValidationErrors } from '../middleware/error.middleware';
import { validateReviewIdParam } from '../middleware/validation.middleware';

const router = Router();

router.use(authMiddleware);

// Toggle like/unlike for a review (authenticated)
router.post('/:reviewId/toggle', validateReviewIdParam, handleValidationErrors, toggleLike);

// Check if current user has liked a review (authenticated)
router.get('/:reviewId/status', validateReviewIdParam, handleValidationErrors, hasUserLikedReview);

// Get like count for a review (public)
router.get('/:reviewId/count', validateReviewIdParam, handleValidationErrors, getLikeCount);

export default router; 