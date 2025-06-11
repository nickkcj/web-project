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
router.get('/:id', getUserById);

// Protected routes
router.get('/', authMiddleware, getUsers);
router.get('/:id', authMiddleware, getUserById);
router.put('/:id', authMiddleware, updateUser);
router.delete('/:id', authMiddleware, deleteUser);

export default router;