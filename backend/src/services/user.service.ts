import { PrismaClient } from '@prisma/client';
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Use environment variable in production
const SALT_ROUNDS = 10;

export const createUser = async (userData: CreateUserDto) => {
  // Hash password before storing
  const hashedPassword = await bcrypt.hash(userData.password, SALT_ROUNDS);
  
  const user = await prisma.user.create({
    data: {
      ...userData,
      password: hashedPassword
    }
  });
  
  // Remove password from returned object
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const getUserById = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });
  
  if (!user) return null;
  
  // Remove password from returned object
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const updateUser = async (userId: number, userData: UpdateUserDto) => {
  // If password is being updated, hash it
  if (userData.password) {
    userData.password = await bcrypt.hash(userData.password, SALT_ROUNDS);
  }
  
  const user = await prisma.user.update({
    where: { id: userId },
    data: userData
  });
  
  // Remove password from returned object
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const getUsers = async () => {
  const users = await prisma.user.findMany();
  
  // Remove passwords from all users
  return users.map((user: any) => {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  });
};

export const deleteUser = async (userId: number) => {
  return prisma.user.delete({
    where: { id: userId }
  });
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    throw new Error('Invalid credentials');
  }

  // Check if the user has a password set. Google authenticated users will not have.
  // If user was created via Google and no password exists, they cannot use this method.
  if (!user.password) {
     throw new Error('Invalid credentials');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  // Generate JWT token
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  // Remove password from returned object
  const { password: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token };
};
