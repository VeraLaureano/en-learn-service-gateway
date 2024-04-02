import { Request } from 'express';
import { User } from './User.interface';

export interface AuthenticatedRequest extends Request {
  user?: User
}