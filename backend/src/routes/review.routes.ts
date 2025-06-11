import { Router } from 'express';
import { createReview, getReviews, getReviewById, getReviewsByUserId, getReviewsByMovieId, deleteReview, updateReview } from '../controllers/review.controller';

const router = Router();

router.post('/', createReview);
router.get('/', getReviews);
router.get('/:id', getReviewById);
router.get('/user/:userId', getReviewsByUserId);
router.get('/movie/:movieId', getReviewsByMovieId);
router.delete('/:id', deleteReview);
router.put('/:id', updateReview);

export default router;