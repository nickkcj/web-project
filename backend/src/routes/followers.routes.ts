import { Router } from 'express';
import { followUser, unfollowUser, getFollowersByUserId, getFollowingByUserId } from '../controllers/follower.controller';

const router = Router();

// Follow user
router.post('/follow', followUser);

// Unfollow user
router.post('/unfollow', unfollowUser);

// Get followers by user id
router.get('/get-followers', getFollowersByUserId);

// Get following by user id
router.get('/get-following', getFollowingByUserId);


export default router; 