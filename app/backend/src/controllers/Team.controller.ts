import { NextFunction, Request, Response } from 'express';
import { statusError } from '../interfaces';
import TeamService from '../services/Team.service';

// require('dotenv/config');

// const secret = process.env.JWT_SECRET as string;

export default class TeamController {
  static async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const teams = await TeamService.getAll();
      res.status(200).json(teams);
    } catch (e) {
      next(e as statusError);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const team = await TeamService.getById(Number(id));
      res.status(200).json(team);
    } catch (e) {
      next(e as statusError);
    }
  }
}
