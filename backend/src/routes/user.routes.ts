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
import { handleValidationErrors } from '../middleware/error.middleware';
import { 
  validateCreateUser, 
  validateUpdateUser, 
  validateLoginUser,
  validateIdParam 
} from '../middleware/validation.middleware';

const router = Router();

// Public routes
router.post('/login', validateLoginUser, handleValidationErrors, loginUser);
router.post('/', validateCreateUser, handleValidationErrors, createUser);

// Protected routes that need authentication
router.get('/', authMiddleware, getUsers);

router.get('/me', authMiddleware, getMyProfile);
router.put('/me', authMiddleware, validateUpdateUser, handleValidationErrors, updateMyProfile);
router.delete('/me', authMiddleware, deleteMyAccount);

router.get('/:id', authMiddleware, validateIdParam, handleValidationErrors, getUserById);
router.put('/:id', authMiddleware, validateIdParam, validateUpdateUser, handleValidationErrors, updateUser);
router.delete('/:id', authMiddleware, validateIdParam, handleValidationErrors, deleteUser);

export default router;