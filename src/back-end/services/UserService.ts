import User from '../models/User.js';
import UserData from '../interfaces/UserData.js'
import bcrypt from "bcrypt";

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

    static async registerUser(userData: UserData) {
        try {
            const { username, email, password } = userData;

            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                console.log("exisxts");
                throw new Error('User already exists');
            }

            const hashedPassword = bcrypt.hashSync(password, 10);

            const newUser = await User.create({
                username,
                email,
                password: hashedPassword,
                created_at: new Date(),
            });

            return newUser;
        } catch (error) {
            console.log("some error");
            console.error('Error occured while trying to register', error);
            return null;
        }
    }

    static async loginUser(email: string, password: string) {
        try {
            const user = await User.findOne({ where: { email } });
            if (!user) {
                throw new Error('User not found');
            }

            const isPasswordValid = bcrypt.compareSync(password, user.password);
            if (!isPasswordValid) {
                throw new Error('Invalid email or password');
            }

            return user;
        } catch (error) {
            console.error('Error occured while trying to login', error);
            return null;
        }
    }
};

export default UserService;
