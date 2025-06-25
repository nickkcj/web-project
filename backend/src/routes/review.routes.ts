import { Router } from 'express';
import { createReview, getReviews, getReviewById, getReviewsByUserId, getReviewsByMovieId, deleteReview, updateReview } from '../controllers/review.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();


router.post('/', authMiddleware, createReview);
router.get('/', authMiddleware, getReviews);


router.get('/user/:userId', authMiddleware, getReviewsByUserId);
router.get('/movie/:movieId', getReviewsByMovieId);


router.get('/:id', getReviewById);
router.put('/:id', authMiddleware, updateReview);
router.delete('/:id', authMiddleware, deleteReview);

export default router;