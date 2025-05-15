import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 3001;
import * as dotenv from 'dotenv';
dotenv.config();

// Middleware
app.use(cors());
app.use(express.json());

import userRoutes from './routes/user.routes';
app.use('/api/users', userRoutes);

import movieRoutes from './routes/movie.routes';
app.use('/api/movies', movieRoutes);

import reviewRoutes from './routes/review.routes';
app.use('/api', reviewRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Add this before app.listen()
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working' });
});

async function main() {
  await prisma.$connect();
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

export default app;