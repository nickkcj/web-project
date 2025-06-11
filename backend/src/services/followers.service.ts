import { prisma } from '../config/database';

export class FollowersService {
  private constructor() {}

  public static async followUser(userId: number, followUserId: number) {
    // Check if both users exist
    const [follower, following] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.user.findUnique({ where: { id: followUserId } })
    ]);

    if (!follower) {
      throw new Error(`User with id ${userId} not found`);
    }
    
    if (!following) {
      throw new Error(`User with id ${followUserId} not found`);
    }

    // Check if relationship already exists
    const existingRelationship = await prisma.userRelationship.findUnique({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: followUserId
        }
      }
    });

    if (existingRelationship) {
      throw new Error('Already following this user');
    }

    return prisma.userRelationship.create({
      data: {
        followerId: userId,
        followingId: followUserId
      }
    });
  }

  public static async unfollowUser(userId: number, unfollowUserId: number) {
    // Check if both users exist
    const [follower, following] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.user.findUnique({ where: { id: unfollowUserId } })
    ]);

    if (!follower) {
      throw new Error(`User with id ${userId} not found`);
    }
    
    if (!following) {
      throw new Error(`User with id ${unfollowUserId} not found`);
    }

    // Check if relationship exists
    const existingRelationship = await prisma.userRelationship.findUnique({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: unfollowUserId
        }
      }
    });

    if (!existingRelationship) {
      throw new Error('Not following this user');
    }

    return prisma.userRelationship.delete({
      where: { followerId_followingId: { followerId: userId, followingId: unfollowUserId } }
    });
  }

  public static async getFollowers(userId: number) {
    // Check if user exists
    const user = await prisma.user.findUnique({ where: { id: userId } });
    
    if (!user) {
      throw new Error(`User with id ${userId} not found`);
    }

    return prisma.userRelationship.findMany({
      where: { followingId: userId },
      include: {
        follower: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
  }

  public static async getFollowing(userId: number) {
    // Check if user exists
    const user = await prisma.user.findUnique({ where: { id: userId } });
    
    if (!user) {
      throw new Error(`User with id ${userId} not found`);
    }

    return prisma.userRelationship.findMany({
      where: { followerId: userId },
      include: {
        following: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
  }
}
