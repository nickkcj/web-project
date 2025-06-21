import { Router } from 'express';
import { createReview, getReviews, getReviewById, getReviewsByUserId, getReviewsByMovieId, deleteReview, updateReview } from '../controllers/review.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Protected routes that need authentication
router.post('/', authMiddleware, createReview);
router.get('/', authMiddleware, getReviews);

// Specific routes before parameterized routes
router.get('/user/:userId', authMiddleware, getReviewsByUserId);
router.get('/movie/:movieId', getReviewsByMovieId);

// Parameterized routes last
router.get('/:id', getReviewById);
router.put('/:id', authMiddleware, updateReview);
router.delete('/:id', authMiddleware, deleteReview);

export default router;