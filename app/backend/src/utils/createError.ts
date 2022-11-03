import { statusError } from '../interfaces';

const createError = (status: number, message: string): statusError => {
  const error = new Error(message) as statusError;
  error.status = status;
  return error;
};

export default createError;
