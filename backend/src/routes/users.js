import { Router } from 'express';
import { getUsers, updateUser, deleteUser } from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.use(protect, authorize('admin'));

router.get('/', getUsers);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
