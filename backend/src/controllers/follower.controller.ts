import { Request, Response } from 'express';
import { FollowersService } from '../services/followers.service';

// Add a follower to a user
export const followUser = async (req: Request, res: Response) => {
  try {
    const { followUserId } = req.body;
    const userId = req.authUser!.userId;
    
    if (!followUserId) {
      return res.status(400).json({ error: 'followUserId is required' });
    }
    
    if (userId === parseInt(followUserId)) {
      return res.status(400).json({ error: 'Cannot follow yourself' });
    }
    
    const follower = await FollowersService.followUser(userId, parseInt(followUserId));
    res.status(201).json({ message: "Followed user successfully.", follower });
  } catch (error: any) {
    console.error('Follow user error:', error);
    res.status(500).json({ 
      error: 'Error creating follower',
      details: {
        name: error.name,
        message: error.message
      }
    });
  }
};

// Unfollow a user
export const unfollowUser = async (req: Request, res: Response) => {
  try {
    const { unfollowUserId } = req.body;
    const userId = req.authUser!.userId;
    
    if (!unfollowUserId) {
      return res.status(400).json({ error: 'unfollowUserId is required' });
    }
    
    if (userId === parseInt(unfollowUserId)) {
      return res.status(400).json({ error: 'Cannot unfollow yourself' });
    }
    
    const follower = await FollowersService.unfollowUser(userId, parseInt(unfollowUserId));
    res.status(201).json({ message: "Unfollowed user successfully.", follower });
  } catch (error: any) {
    console.error('Unfollow user error:', error);
    res.status(500).json({ 
      error: 'Error unfollowing user',
      details: {
        name: error.name,
        message: error.message
      }
    });
  }
};

// Get all followers for a user
export const getFollowersByUserId = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    
    const parsedUserId = parseInt(userId);
    if (isNaN(parsedUserId)) {
      return res.status(400).json({ error: 'userId must be a valid number' });
    }
    
    const followers = await FollowersService.getFollowers(parsedUserId);
    res.json({ message: "Followers fetched successfully.", followers });
  } catch (error: any) {
    console.error('Get followers error:', error);
    res.status(500).json({ 
      error: 'Error fetching followers',
      details: {
        name: error.name,
        message: error.message
      }
    });
  }
};

// Get all following for a user
export const getFollowingByUserId = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    
    const parsedUserId = parseInt(userId);
    if (isNaN(parsedUserId)) {
      return res.status(400).json({ error: 'userId must be a valid number' });
    }
    
    const following = await FollowersService.getFollowing(parsedUserId);
    res.json({ message: "Following fetched successfully.", following });
  } catch (error: any) {
    console.error('Get following error:', error);
    res.status(500).json({ 
      error: 'Error fetching following',
      details: {
        name: error.name,
        message: error.message
      }
    });
  }
};


