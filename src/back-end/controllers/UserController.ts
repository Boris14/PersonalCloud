import { Request, Response, request } from 'express';
import UserService from '../services/UserService.js';

class UserController {
    static async createUser(req: Request, res: Response) {
        try {
            const requestBody = req.body;
            const newUser = await UserService.createUser(requestBody);
            if(newUser != null) {
                res.status(201).json(newUser);
            }
            else {
                res.status(499).json({ message: 'Couldn\'t create user' });
            }
        } catch (error) {
            console.error('Error creating user:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async getUserById(req: Request, res: Response) {
        try {
            const userId: string = req.params.userId;
            const user = await UserService.getUserById(userId);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.status(200).json(user);
        } catch (error) {
            console.error('Error getting user by ID:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async updateUser(req: Request, res: Response) {
        try {
            const userId: string = req.params.userId;
            const userData = req.body;
            const updatedUser = await UserService.updateUser(userId, userData);
            if (updatedUser != null) {
                res.status(200).json(updatedUser);
            }
            else {
                res.status(400).json({ error: 'Internal server error' });
            }
        } catch (error) {
            console.error('Error updating user:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async deleteUser(req: Request, res: Response) {
        try {
            const userId: string = req.params.userId;
            const result = await UserService.deleteUser(userId);
            if(result) {
                res.status(200).json(result);
            }
            else {
                res.status(400).json(result);
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async registerUser(req: Request, res: Response) {
        try {
            const requestBody = req.body;
            const newUser = await UserService.registerUser(requestBody);
            if (newUser != null) {
                res.status(201).json(newUser);
            } else {
                res.status(409).json({ message: 'User already exists' });
            }
        } catch (error) {
            console.error('Error registering user:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async loginUser(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const user = await UserService.loginUser(email, password);
            if (user != null) {
                res.status(200).json(user);
            } else {
                res.status(401).json({ message: 'Invalid email or password' });
            }
        } catch (error) {
            console.error('Error logging in user:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

export default UserController;