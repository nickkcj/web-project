import { Router } from 'express';
import { createComment, getCommentsByReviewId } from '../controllers/comments.controler';
import { authMiddleware } from '../middleware/auth.middleware';
import { handleValidationErrors } from '../middleware/error.middleware';
import { validateCreateComment, validateReviewIdParam } from '../middleware/validation.middleware';

const router = Router();

router.use(authMiddleware);

router.post('/:reviewId', validateReviewIdParam, validateCreateComment, handleValidationErrors, createComment);
router.get('/:reviewId', validateReviewIdParam, handleValidationErrors, getCommentsByReviewId);

export default router; 