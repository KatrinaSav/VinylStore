import { Controller, Get, Query } from '@nestjs/common';
import { LogService } from './log.service';
import { AccessRoles } from '../common/roles.decorator';
import { Roles } from '../user/roles.enum';
import { Log } from './log.entity';
import { LogQueryDto } from './dto/log-query.dto';
import {
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('logs')
@Controller('logs')
export class LogController {
  constructor(private readonly logService: LogService) {}

  @ApiTags('Allowed role: Admin')
  @ApiOperation({ summary: 'Get logs of the server' })
  @ApiOkResponse({ description: 'Returns list of  logs', type: [Log] })
  @AccessRoles([Roles.Admin])
  @Get()
  async getLogs(@Query() queryParams: LogQueryDto): Promise<Log[]> {
    return await this.logService.getLogs(queryParams);
  }
}
