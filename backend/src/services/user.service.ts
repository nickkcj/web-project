import { PrismaClient } from '@prisma/client';
import { CreateUserDto } from '../dtos/user.dto';

const prisma = new PrismaClient();

export const createUser = async (userData: CreateUserDto) => {
  return prisma.user.create({
    data: userData
  });
};

export const getUserById = async (userId: number) => {
  return prisma.user.findUnique({
    where: { id: userId }
  });
};

export const updateUser = async (userId: number, userData: CreateUserDto) => {
  return prisma.user.update({
    where: { id: userId },
    data: userData
  });
};

export const getUsers = async () => {
  return prisma.user.findMany();
};

export const deleteUser = async (userId: number) => {
  return prisma.user.delete({
    where: { id: userId }
  });
};
