import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { VinylRecordService } from './vinyl-record.service';
import { CreateVinylRecordDto } from './dto/create-vinyl-record.dto';
import { VinylRecord } from './vinyl-record.entity';
import { ReqUser } from '../common/req-user.decorator';
import { VinylRecordResponse } from './types/vinyl-record-response.type';
import { VinylRecordQueryDto } from './dto/vinyl-record-query.dto';
import { AccessRoles } from '../common/roles.decorator';
import { Roles } from '../user/roles.enum';
import { PriceDto } from './dto/price.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { RequestUser } from '../user/types/request-user.type';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateVinylRecordDto } from './dto/edit-vinyl-record.dto';

@ApiTags('vinyl-records')
@Controller('vinyl-records')
export class VinylRecordController {
  constructor(private readonly vinylRecordServise: VinylRecordService) {}

  @ApiOperation({ summary: 'Get vinyl-records based on query' })
  @ApiOkResponse({
    description: 'Returns list of  vinyl records',
    type: [VinylRecord],
  })
  @Get()
  async getVinylRecordsList(
    @ReqUser() user: RequestUser,
    @Query() queryParams: VinylRecordQueryDto,
  ): Promise<VinylRecordResponse[]> {
    return await this.vinylRecordServise.getAllVinylRecords(queryParams, user);
  }

  @ApiOperation({ summary: 'Create new vinyl-record' })
  @ApiBody({ type: CreateVinylRecordDto })
  @ApiCreatedResponse({
    description: 'Returns new vinyl record',
    type: VinylRecord,
  })
  @ApiTags('Allowed role: Admin')
  @AccessRoles([Roles.Admin])
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async addVinylRecord(
    @Body() body: CreateVinylRecordDto,
    @ReqUser('id') userId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1e6 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ): Promise<VinylRecord> {
    return await this.vinylRecordServise.addVinylRecord(body, userId, file);
  }

  @ApiOperation({ summary: 'Add vinyl-record from discogs' })
  @ApiTags('Allowed role: Admin')
  @ApiCreatedResponse({
    description: 'Returns new vinyl record',
    type: VinylRecord,
  })
  @ApiBody({ type: [CreateVinylRecordDto] })
  @ApiParam({ name: 'id', description: 'Id of release on discogs' })
  @AccessRoles([Roles.Admin])
  @Post('/discogs/:id')
  async addVinylRecordFromDiscogs(
    @Param('id', ParseIntPipe) discogsId: number,
    @ReqUser('id') userId: string,
    @Body() price: PriceDto,
  ): Promise<VinylRecord> {
    return await this.vinylRecordServise.addVinylRecordFromDiscogs(
      discogsId,
      userId,
      price.price,
    );
  }

  @ApiOperation({ summary: 'Add vinyl-record from discogs' })
  @ApiBody({ type: [PriceDto] })
  @ApiParam({ name: 'id', description: 'Id of release on discogs' })
  @ApiTags('Allowed role: Admin')
  @AccessRoles([Roles.Admin])
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  async editVinylRecord(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: UpdateVinylRecordDto,
    @ReqUser('id') userId: string,
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
  ): Promise<VinylRecord> {
    if (file)
      return await this.vinylRecordServise.updateVinylRecordWithImage(
        id,
        body,
        userId,
        file,
      );
    else
      return await this.vinylRecordServise.updateVinylRecord(id, body, userId);
  }

  @ApiOperation({ summary: 'Edit vinyl-record' })
  @ApiBody({ type: [UpdateVinylRecordDto] })
  @ApiTags('Allowed role: Admin')
  @ApiParam({ name: 'id', description: 'Id of vinyl-record' })
  @ApiNotFoundResponse({ description: 'Vinyl record is not found' })
  @AccessRoles([Roles.Admin])
  @Delete(':id')
  async deleteVynilRecord(
    @Param('id', new ParseUUIDPipe()) id: string,
    @ReqUser('id') userId: string,
  ): Promise<VinylRecord> {
    return await this.vinylRecordServise.deleteVinylRecord(id, userId);
  }
}
