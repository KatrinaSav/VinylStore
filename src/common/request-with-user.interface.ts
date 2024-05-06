import { Request } from 'express';
import { Roles } from '../user/roles.enum';
import { RequestUser } from '../user/types/request-user.type';

export interface RequestWithUser extends Request {
  user?: RequestUser;
}
