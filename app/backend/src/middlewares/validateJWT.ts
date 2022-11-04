import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import UserService from '../services/User.service';

require('dotenv/config');

const secret = process.env.JWT_SECRET;

const validateJWT = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ message: 'Token not found' });
  }
  try {
    const decoded = jwt.verify(token, secret as string) as jwt.JwtPayload;
    const { id } = decoded.data;
    const users = await UserService.getAll();
    if (users.every((u) => u.id !== id)) throw new Error();
    next();
  } catch (_e) {
    return res.status(401).json({ message: 'Token must be a valid token' });
  }
};

export default validateJWT;
