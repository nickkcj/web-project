import express from 'express';
import cors from 'cors';
import DatabaseService from './config/database';
import userRoutes from './routes/user.routes';
import reviewRoutes from './routes/review.routes';
import movieRoutes from './routes/movie.routes';
import authRoutes from './routes/auth.routes';
import passport from './config/passport';
import followersRoutes from './routes/followers.routes';
import commentRoutes from './routes/comment.routes';
import likeRoutes from './routes/like.routes';
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

app.use('/api/users', userRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/followers', followersRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/likes', likeRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Add this before app.listen()
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working' });
});

async function main() {
  await DatabaseService.connect();
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await DatabaseService.disconnect();
  });

export default app;