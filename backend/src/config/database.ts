import { PrismaClient } from '@prisma/client';

class DatabaseService {
  private static instance: PrismaClient;

  public static getInstance(): PrismaClient {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new PrismaClient({
        log: ['query', 'info', 'warn', 'error'],
      });
    }
    return DatabaseService.instance;
  }

  public static async connect(): Promise<void> {
    await DatabaseService.getInstance().$connect();
  }

  public static async disconnect(): Promise<void> {
    await DatabaseService.getInstance().$disconnect();
  }
}

export const prisma = DatabaseService.getInstance();
export default DatabaseService; 