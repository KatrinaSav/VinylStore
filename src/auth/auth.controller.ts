// auth.controller.ts
import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { GoogleAuthGuard } from './google-auth.guard';
import { AccessRoles } from 'src/common/roles.decorator';
import { Roles } from 'src/user/roles.enum';
import {
  ApiCreatedResponse,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  @ApiOperation({ summary: 'Login via google' })
  @ApiCreatedResponse({ description: 'User will be authorized' })
  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  async handleLogin() {}

  @ApiExcludeEndpoint()
  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  async googleLoginCallback() {
    return { msg: 'Authorized successfully' };
  }

  @ApiTags('Allowed role: Admin', 'Allowed role: User')
  @ApiOperation({ summary: 'Logout from account' })
  @ApiCreatedResponse({
    description: 'Returns message "Successfully logged out"',
  })
  @Post('logout')
  @AccessRoles([Roles.User, Roles.Admin])
  async logout(@Req() req: Request) {
    req.session.destroy(() => {});
    return { msg: 'Successfully logged out' };
  }
}
