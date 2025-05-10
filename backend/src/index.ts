import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

import userRoutes from './routes/user.routes';
app.use('/api', userRoutes);

import movieRoutes from './routes/movie.routes';
app.use('/api/movies', movieRoutes);

import reviewRoutes from './routes/review.routes';
app.use('/api', reviewRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
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