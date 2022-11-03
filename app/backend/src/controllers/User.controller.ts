import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { statusError } from '../interfaces';
import UserDTO from '../dtos/UserDTO';
import UserService from '../services/User.service';

require('dotenv/config');

const secret = process.env.JWT_SECRET as string;

export default class UserController {
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { body } = req;
      const id = await UserService.login(body as UserDTO);
      const data = { id };
      const token = jwt.sign({ data }, secret, { expiresIn: '7d', algorithm: 'HS256' });
      res.status(200).json({ token });
    } catch (e) {
      next(e as statusError);
    }
  }

  static async loginValidate(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.header('Authorization') as string;
      const decoded = jwt.verify(token, secret as string) as jwt.JwtPayload;
      const { id } = decoded.data;
      const user = await UserService.getById(id);
      res.status(200).json({ role: user.role });
    } catch (e) {
      next(e as statusError);
    }
  }
}
