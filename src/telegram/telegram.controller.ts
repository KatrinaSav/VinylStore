import { Controller, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { AccessRoles } from 'src/common/roles.decorator';
import { Roles } from 'src/user/roles.enum';
import {
  ApiCreatedResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('telegram')
@Controller('telegram')
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {}

  @ApiOperation({ summary: 'Post vinyl record on telegram' })
  @ApiParam({ name: 'id', description: 'Id of vinyl-record' })
  @ApiCreatedResponse({ description: 'Vinyl record is posted on telegram' })
  @ApiTags('Allowed role: Admin')
  @Post('vinyl-record/:id')
  @AccessRoles([Roles.Admin])
  async postVinylRecord(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.telegramService.postVinylRecord(id);
    return { msg: 'Vinyl record is posted on telegram' };
  }
}
