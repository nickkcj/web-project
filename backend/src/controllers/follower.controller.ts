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
    const { userId } = req.params;
    
    if (isNaN(parseInt(userId))) {
      throw new AppError('Invalid user ID parameter', 400);
    }

    const parsedUserId = parseInt(userId);
    if (isNaN(parsedUserId)) {
      return res.status(400).json({ error: 'userId must be a valid number' });
    }

    const followers = await FollowersService.getFollowers(parsedUserId);
    res.json({ message: "Followers fetched successfully.", followers });
  }
);

// Get all following for a user
export const getFollowingByUserId = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId } = req.params;
    
    if (isNaN(parseInt(userId))) {
      throw new AppError('Invalid user ID parameter', 400);
    }

    const parsedUserId = parseInt(userId);
    if (isNaN(parsedUserId)) {
      return res.status(400).json({ error: 'userId must be a valid number' });
    }

    const following = await FollowersService.getFollowing(parsedUserId);
    res.json({ message: "Following fetched successfully.", following });
  }
);


