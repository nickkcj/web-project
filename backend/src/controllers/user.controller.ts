import { Request, Response } from 'express';
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';
import { UserService } from '../services/user.service';
import { asyncHandler, AppError } from '../middleware/error.middleware';

export const createUser = asyncHandler(
  async (req: Request, res: Response) => {
    const userData: CreateUserDto = req.body;
    const user = await UserService.createUser(userData);
    res.status(201).json(user);
  }
);

// Get authenticated user's profile
export const getMyProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.authUser!.userId;
    const user = await UserService.getUserById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    res.json(user);
  }
);

// Get any user by ID
export const getUserById = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id, 10);

    if (isNaN(userId)) {
      throw new AppError('Invalid user ID', 400);
    }

    const user = await UserService.getUserById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    res.json(user);
  }
);

// Update authenticated user's profile
export const updateMyProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.authUser!.userId;
    const userData: UpdateUserDto = req.body;
    const user = await UserService.updateUser(userId, userData);
    res.json(user);
  }
);

export const updateUser = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id, 10);

    if (isNaN(userId)) {
      throw new AppError('Invalid user ID', 400);
    }

    // Check if user is updating their own profile
    if (req.authUser && req.authUser.userId !== userId) {
      throw new AppError('You can only update your own profile', 403);
    }

    const userData: UpdateUserDto = req.body;
    const user = await UserService.updateUser(userId, userData);
    res.json(user);
  }
);

export const getUsers = asyncHandler(
  async (req: Request, res: Response) => {
    const users = await UserService.getUsers();
    res.json(users);
  }
);

// Delete authenticated user's account
export const deleteMyAccount = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.authUser!.userId;
    await UserService.deleteUser(userId);
    res.status(204).send();
  }
);

export const deleteUser = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id, 10);

    if (isNaN(userId)) {
      throw new AppError('Invalid user ID', 400);
    }

    if (req.authUser && req.authUser.userId !== userId) {
      throw new AppError('You can only delete your own account', 403);
    }

    await UserService.deleteUser(userId);
    res.status(204).send();
  }
);

export const loginUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError('Email and password are required', 400);
    }

    const { user, token } = await UserService.loginUser(email, password);
    res.json({ user, token });
  }
);