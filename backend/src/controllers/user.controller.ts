import { Request, Response } from 'express';
import { CreateUserDto } from '../dtos/user.dto';
import * as userService from '../services/user.service';

export const createUser = async (req: Request, res: Response) => {
  try {
    const userData: CreateUserDto = req.body;
    const user = await userService.createUser(userData);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error creating user' });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id, 10);
    const user = await userService.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user' });
  }
}

export const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id, 10);
    const userData: CreateUserDto = req.body;
    const user = await userService.updateUser(userId, userData);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error updating user' });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.getUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users' });
  }
};