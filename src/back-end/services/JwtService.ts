import jwt from 'jsonwebtoken';
import { jwtSecret } from '../../jwt-config.js';
import User from '../models/User.js';
import { Request, Response, NextFunction } from 'express';

class JwtService {

  static generateToken = (user: User) => {
    return jwt.sign({ id: user.id, email: user.email }, jwtSecret.jwtSecret, {
      expiresIn: jwtSecret.jwtExpiresIn,
    });
  };

  static verifyToken = (token: string) => {
    return jwt.verify(token, jwtSecret.jwtSecret);
  };

  static authenticate = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).send('Access denied. No token provided.');
    }
    try {
      this.verifyToken(token);
      next();
    } catch (error) {
      res.status(400).send('Invalid token.');
    }
  };

}

export default JwtService;