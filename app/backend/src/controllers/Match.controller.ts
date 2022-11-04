import { NextFunction, Request, Response } from 'express';
import realBoolean from '../utils/realBoolean';
import { statusError } from '../interfaces';
import MatchService from '../services/Match.service';

export default class MatchController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { inProgress } = req.query;
      const matches = await MatchService.getAll(realBoolean(inProgress as string) as boolean);
      res.status(200).json(matches);
    } catch (e) {
      next(e as statusError);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { body } = req;
      const match = await MatchService.create(body);
      res.status(201).json(match);
    } catch (e) {
      next(e as statusError);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { body } = req;
      const { id } = req.params;
      await MatchService.update(Number(id), body);
      res.status(200).json({ message: 'Updated' });
    } catch (e) {
      next(e as statusError);
    }
  }

  static async finish(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await MatchService.finish(Number(id));
      res.status(200).json({ message: 'Finished' });
    } catch (e) {
      next(e as statusError);
    }
  }

  // static async getById(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     const { id } = req.params;
  //     const team = await TeamService.getById(Number(id));
  //     res.status(200).json(team);
  //   } catch (e) {
  //     next(e as statusError);
  //   }
  // }
}
