import { Router } from 'express';
import { createReview, getReviews, getReviewById, getReviewsByUserId, getReviewsByMovieId, deleteReview, updateReview } from '../controllers/review.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authMiddleware, createReview);
router.get('/', authMiddleware, getReviews);
router.get('/:id', getReviewById);
router.get('/user/:userId', getReviewsByUserId);
router.get('/movie/:movieId', getReviewsByMovieId);
router.delete('/:id', authMiddleware, deleteReview);
router.put('/:id', authMiddleware, updateReview);

export default router;