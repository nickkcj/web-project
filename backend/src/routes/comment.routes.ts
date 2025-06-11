import { Router } from 'express';
import { createComment, getCommentsByReviewId } from '../controllers/comments.controler';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.get('/:reviewId', authMiddleware, getCommentsByReviewId);
router.post('/:reviewId', authMiddleware, createComment);

export default router; 