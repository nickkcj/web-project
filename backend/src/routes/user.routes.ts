import { Router } from 'express';
import { createUser, getUsers, getUserById, updateUser, deleteUser, loginUser } from '../controllers/user.controller';

const router = Router();

// Add the login route
router.post('/login', loginUser);
router.post('/', createUser);
router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;