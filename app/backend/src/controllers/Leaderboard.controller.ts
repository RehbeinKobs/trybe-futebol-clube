import { NextFunction, Request, Response } from 'express';
import { statusError } from '../interfaces';
import LeaderboardService from '../services/Leaderboard.service';

export default class LeaderboardController {
  static async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const leaderboard = await LeaderboardService.getAll();
      res.status(200).json(leaderboard);
    } catch (e) {
      next(e as statusError);
    }
  }

  static async getAllHome(_req: Request, res: Response, next: NextFunction) {
    try {
      const leaderboard = await LeaderboardService.getAllHome();
      res.status(200).json(leaderboard);
    } catch (e) {
      next(e as statusError);
    }
  }

  static async getAllAway(_req: Request, res: Response, next: NextFunction) {
    try {
      const leaderboard = await LeaderboardService.getAllAway();
      res.status(200).json(leaderboard);
    } catch (e) {
      next(e as statusError);
    }
  }
}
