import { Router } from 'express';
import { createUser, getUsers, getUserById, updateUser, deleteUser } from '../controllers/user.controller';

const router = Router();

router.post('/users', createUser);
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

export default router;