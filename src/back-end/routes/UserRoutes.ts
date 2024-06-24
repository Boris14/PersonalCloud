import express from 'express';
import UserController from '../controllers/UserController.js';

const router = express.Router();

router.post('/users', UserController.createUser);
router.get('/users/:userId', UserController.getUserById);
router.put('/users/:userId', UserController.updateUser);
router.delete('/users/:userId', UserController.deleteUser);
router.post('/users/register', UserController.registerUser);
router.post('/users/login', UserController.loginUser);

export default router;