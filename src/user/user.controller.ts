import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  ParseFilePipe,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ReqUser } from '../common/req-user.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { User } from './user.entity';
import { AccessRoles } from 'src/common/roles.decorator';
import { Roles } from './roles.enum';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiTags('Allowed role: User')
  @AccessRoles([Roles.User])
  @ApiOperation({ summary: 'Get user profile' })
  @ApiOkResponse({ description: 'Returns the user profile', type: User })
  @Get('profile')
  async getProfile(@ReqUser('id') userId: string): Promise<User> {
    return await this.userService.getProfile(userId);
  }

  @ApiTags('Allowed role: User')
  @AccessRoles([Roles.User])
  @ApiOperation({ summary: 'Edit user profile' })
  @ApiOkResponse({
    description: 'Returns the updated user profile',
    type: User,
  })
  @UseInterceptors(FileInterceptor('image'))
  @Patch('profile')
  async editProfile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1e6 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
        fileIsRequired: false,
      }),
    )
    file: Express.Multer.File,
    @ReqUser('id') userId: string,
    @Body() body: UpdateProfileDto,
  ): Promise<User> {
    if (file)
      return await this.userService.updateProfileWithAvatar(userId, body, file);
    else
      return await this.userService.updateProfileWithAvatar(userId, body, file);
  }

  @ApiTags('Allowed role: User')
  @AccessRoles([Roles.User])
  @ApiOperation({ summary: 'Delete user profile' })
  @ApiOkResponse({
    description: 'Returns the deleted user profile',
    type: User,
  })
  @Delete('profile')
  async deleteProfile(
    @ReqUser('id') userId: string,
    @Req() req,
  ): Promise<User> {
    req.session.destroy();
    return await this.userService.deleteProfile(userId);
  }
}
