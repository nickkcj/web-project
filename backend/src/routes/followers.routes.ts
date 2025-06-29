import { Router } from 'express';
import { followUser, unfollowUser, getFollowersByUserId, getFollowingByUserId } from '../controllers/follower.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/follow', authMiddleware, followUser);
router.post('/unfollow', authMiddleware, unfollowUser);
router.post('/get-followers', authMiddleware, getFollowersByUserId);
router.post('/get-following', authMiddleware, getFollowingByUserId);

export default router;