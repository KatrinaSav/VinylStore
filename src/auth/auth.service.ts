import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { RequestUser } from '../user/types/request-user.type';
import { UserValidation } from './types/user-validation.type';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async validateUser(userData: UserValidation): Promise<RequestUser> {
    const user = await this.userService.findByEmail(userData.email);
    if (user) return { id: user.id, role: user.role };
    return await this.userService.createUser(userData);
  }
}
