import { Router } from 'express';
import { createReview, getReviews, getReviewById, getReviewsByUserId, getReviewsByMovieId } from '../controllers/review.controller';

const router = Router();

router.post('/reviews', createReview);
router.get('/reviews', getReviews);
router.get('/reviews/:id', getReviewById);
router.get('/reviews/user/:userId', getReviewsByUserId);
router.get('/reviews/movie/:movieId', getReviewsByMovieId);

export default router;