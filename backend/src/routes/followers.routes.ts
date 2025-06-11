import { Router } from 'express';
import { followUser, unfollowUser, getFollowersByUserId, getFollowingByUserId } from '../controllers/follower.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/follow', authMiddleware, followUser);
router.post('/unfollow', authMiddleware, unfollowUser);
router.get('/get-followers', authMiddleware, getFollowersByUserId);
router.get('/get-following', authMiddleware, getFollowingByUserId);

export default router;  