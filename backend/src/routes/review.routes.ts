import { Router } from 'express';
import {
  createReview,
  getReviewById,
  getReviews,
  getReviewsByUserId,
  getReviewsByMovieId,
  updateReview,
  deleteReview
} from '../controllers/review.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { handleValidationErrors } from '../middleware/error.middleware';
import {
  validateCreateReview,
  validateUpdateReview,
  validateIdParam,
  validateUserIdParam,
  validateMovieIdParam
} from '../middleware/validation.middleware';

const router = Router();

router.use(authMiddleware);

router.post('/', validateCreateReview, handleValidationErrors, createReview);
router.get('/', getReviews);
router.get('/:id', validateIdParam, handleValidationErrors, getReviewById);
router.put('/:id', validateIdParam, validateUpdateReview, handleValidationErrors, updateReview);
router.delete('/:id', validateIdParam, handleValidationErrors, deleteReview);

router.get('/user/:userId', validateUserIdParam, handleValidationErrors, getReviewsByUserId);
router.get('/movie/:movieId', validateMovieIdParam, handleValidationErrors, getReviewsByMovieId);

export default router;