import { Request, Response } from 'express';
import { FollowersService } from '../services/followers.service';
import { asyncHandler, AppError } from '../middleware/error.middleware';

// Add a follower to a user
export const followUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { followUserId } = req.body;
    const userId = req.authUser!.userId;
    
    if (!followUserId) {
      throw new AppError('followUserId is required', 400);
    }
    
    if (userId === parseInt(followUserId)) {
      throw new AppError('Cannot follow yourself', 400);
    }
    
    const follower = await FollowersService.followUser(
      userId,
      parseInt(followUserId)
    );
    res.status(201).json({ message: "Followed user successfully.", follower });
  }
);

// Unfollow a user
export const unfollowUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { unfollowUserId } = req.body;
    const userId = req.authUser!.userId;
    
    if (!unfollowUserId) {
      throw new AppError('unfollowUserId is required', 400);
    }
    
    if (userId === parseInt(unfollowUserId)) {
      throw new AppError('Cannot unfollow yourself', 400);
    }
    
    const follower = await FollowersService.unfollowUser(
      userId,
      parseInt(unfollowUserId)
    );
    res
      .status(201)
      .json({ message: "Unfollowed user successfully.", follower });
  }
);

// Get all followers for a user
export const getFollowersByUserId = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId, 10);
    
    if (isNaN(userId)) {
      throw new AppError('Invalid user ID parameter', 400);
    }
    
    const followers = await FollowersService.getFollowers(userId);
    res.json({ message: "Followers fetched successfully.", followers });
  }
);

// Get all following for a user
export const getFollowingByUserId = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId, 10);
    
    if (isNaN(userId)) {
      throw new AppError('Invalid user ID parameter', 400);
    }
    
    const following = await FollowersService.getFollowing(userId);
    res.json({ message: "Following fetched successfully.", following });
  }
);


