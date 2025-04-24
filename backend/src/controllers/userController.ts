import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { CreateUserDto } from '../dtos/user.dto';

const prisma = new PrismaClient();

export const createUser = async (req: Request, res: Response) => {
  try {
    const userData: CreateUserDto = req.body;
    const user = await prisma.user.create({
      data: userData
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error creating user' });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users' });
  }
};