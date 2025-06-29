import { Router } from 'express';
import {
  followUser,
  unfollowUser,
  getFollowersByUserId,
  getFollowingByUserId
} from '../controllers/follower.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { handleValidationErrors } from '../middleware/error.middleware';
import { validateFollowUser, validateUnfollowUser, validateUserIdParam } from '../middleware/validation.middleware';

const router = Router();

router.use(authMiddleware);

router.post('/follow', validateFollowUser, handleValidationErrors, followUser);
router.post('/unfollow', validateUnfollowUser, handleValidationErrors, unfollowUser);
router.get('/:userId/followers', validateUserIdParam, handleValidationErrors, getFollowersByUserId);
router.get('/:userId/following', validateUserIdParam, handleValidationErrors, getFollowingByUserId);

export default router;