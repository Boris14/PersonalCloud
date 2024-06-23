import User from '../models/User.js';
import UserData from '../interfaces/UserData.js'

class UserService {
    static async createUser(userData: UserData): Promise<User | null> {
        try {
            return await User.create({
                username: userData.username,
                password: userData.password,
                email: userData.email,
            });
        } catch (error) {
            console.error('Error creating user:', error);
            return null;
        }
    }

    static async getUserById(userId: string): Promise<User | null> {
        try {
            return await User.findByPk(userId);
        } catch (error) {
            console.error('Error getting user:', error);
            return null;
        }
    }

    static async updateUser(userId: string, newData: UserData): Promise<User | null> {
        try {
            const user = await User.findByPk(userId);
            if (user) {
                return await user.update(newData);
            }
            return null;
        } catch (error) {
            console.error('Error updating user:', error);
            return null;
        }
    }

    static async deleteUser(userId: string): Promise<boolean> {
        try {
            const user = await User.findByPk(userId);
            if (user) {
                await user.destroy();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error deleting user:', error);
            return false;
        }
    }
};

export default UserService;
