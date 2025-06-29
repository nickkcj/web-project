import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { prisma } from '../config/database';
import { AppError } from '../middleware/error.middleware';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Use environment variable in production
const SALT_ROUNDS = 10;

export class UserService {
  private constructor() {}
    
  public static async createUser(userData: CreateUserDto) {
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
  }
  
  public static async getUserById(userId: number) {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) return null;
    
    // Remove password from returned object
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  
  public static async updateUser(userId: number, userData: UpdateUserDto) {
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
  }
  
  public static async getUsers() {
    const users = await prisma.user.findMany();
    
    // Remove passwords from all users
    return users.map((user: any) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }
  
  public static async deleteUser(userId: number) {
    return prisma.user.delete({
      where: { id: userId }
    });
  }
  
  public static async loginUser(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email }
    });
  
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }
  
    // Check if the user has a password set. Google authenticated users will not have.
    // If user was created via Google and no password exists, they cannot use this method.
    if (!user.password) {
       throw new AppError('Invalid credentials', 401);
    }
  
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
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
  }
}
