import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import userRoutes from './routes/user.routes';
import reviewRoutes from './routes/review.routes';
import movieRoutes from './routes/movie.routes';
import authRoutes from './routes/auth.routes';
import passport from './config/passport';

const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 3001;
import * as dotenv from 'dotenv';
dotenv.config();

// Middleware
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

app.use('/api/users', userRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/auth', authRoutes);

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