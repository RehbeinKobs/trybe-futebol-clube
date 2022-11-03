import { NextFunction, Request, Response } from 'express';
import { statusError } from '../interfaces';

const handleError = (error: statusError, _req: Request, res: Response, _next: NextFunction) => {
  if (error.status) return res.status(error.status).json({ message: error.message });
  return res.status(500).json({ message: error.message });
};

export default handleError;
