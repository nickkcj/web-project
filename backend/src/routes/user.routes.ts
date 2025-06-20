import { Router } from 'express';
import { 
  createUser, 
  getUsers, 
  getUserById, 
  updateUser, 
  deleteUser, 
  loginUser,
  getMyProfile,
  updateMyProfile,
  deleteMyAccount
} from '../controllers/user.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.post('/login', loginUser);
router.post('/', createUser);

// Protected routes that need authentication
router.get('/', authMiddleware, getUsers);
router.get('/:id', authMiddleware, getUserById);
router.put('/:id', authMiddleware, updateUser);
router.delete('/:id', authMiddleware, deleteUser);

// Profile routes (authenticated user's own profile)
router.get('/me', authMiddleware, getMyProfile);
router.put('/me', authMiddleware, updateMyProfile);
router.delete('/me', authMiddleware, deleteMyAccount);

export default router;