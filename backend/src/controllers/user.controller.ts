import { Request, Response } from 'express';
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';
import { UserService } from '../services/user.service';

export const createUser = async (req: Request, res: Response) => {
  try {
    const userData: CreateUserDto = req.body;
    const user = await UserService.createUser(userData);
    res.status(201).json(user);
  } catch (error: any) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: error.message || 'Error creating user' });
  }
};

// Get authenticated user's profile
export const getMyProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.authUser!.userId;
    const user = await UserService.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error: any) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: error.message || 'Error fetching user profile' });
  }
};

// Get any user by ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id, 10);
    
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const user = await UserService.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error: any) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: error.message || 'Error fetching user' });
  }
};

// Update authenticated user's profile
export const updateMyProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.authUser!.userId;
    const userData: UpdateUserDto = req.body;
    const user = await UserService.updateUser(userId, userData);
    res.json(user);
  } catch (error: any) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: error.message || 'Error updating user profile' });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id, 10);
    
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    
    // Check if user is updating their own profile
    if (req.authUser && req.authUser.userId !== userId) {
      return res.status(403).json({ error: 'You can only update your own profile' });
    }
    
    const userData: UpdateUserDto = req.body;
    const user = await UserService.updateUser(userId, userData);
    res.json(user);
  } catch (error: any) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: error.message || 'Error updating user' });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await UserService.getUsers();
    res.json(users);
  } catch (error: any) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: error.message || 'Error fetching users' });
  }
};

// Delete authenticated user's account
export const deleteMyAccount = async (req: Request, res: Response) => {
  try {
    const userId = req.authUser!.userId;
    await UserService.deleteUser(userId);
    res.status(204).send();
  } catch (error: any) {
    console.error('Error deleting user account:', error);
    res.status(500).json({ error: error.message || 'Error deleting user account' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id, 10);
    
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    
    
    if (req.authUser && req.authUser.userId !== userId) {
      return res.status(403).json({ error: 'You can only delete your own account' });
    }
    
    await UserService.deleteUser(userId);
    res.status(204).send();
  } catch (error: any) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: error.message || 'Error deleting user' });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    const { user, token } = await UserService.loginUser(email, password);
    res.json({ user, token });
  } catch (error: any) {
    console.error('Error during login:', error);
    // Don't expose detailed error messages for login failures
    res.status(401).json({ error: 'Invalid credentials' });
  }
};