import { Controller, Get, Param, Res, StreamableFile } from '@nestjs/common';
import { ImageService } from './image.service';
import { Readable } from 'stream';
import { Response } from 'express';
import {
  ApiOperation,
  ApiParam,
  ApiProduces,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('image')
@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}
  @ApiOperation({ summary: 'Get image' })
  @ApiProduces('image')
  @ApiParam({ name: 'id', description: 'Id of image' })
  @ApiResponse({
    status: 200,
    schema: {
      type: 'string',
      format: 'binary',
    },
  })
  @Get(':id')
  async getImage(
    @Param('id') id: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const image = await this.imageService.getImage(id);
    const stream = Readable.from(image.data);

    response.set({
      'Content-Disposition': 'inline',
      'Content-Type': 'image/png',
    });
    return new StreamableFile(stream);
  }
}
