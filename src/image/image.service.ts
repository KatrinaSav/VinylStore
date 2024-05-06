import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Image } from './image.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Image) private readonly repository: Repository<Image>,
  ) {}

  async saveImageFromUrl(url: string): Promise<Image> {
    try {
      const response = await fetch(url);
      return await this.repository.save({
        data: new Uint8Array(await response.arrayBuffer()),
      });
    } catch (error) {
      throw new HttpException(
        `Failed to save vinyl-record image: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async saveImage(file: Express.Multer.File): Promise<Image> {
    return await this.repository.save({ data: file.buffer });
  }

  async deleteImage(id: string) {
    const image = await this.findById(id);
    if (!image)
      throw new HttpException('Image is not found', HttpStatus.NOT_FOUND);
    await this.repository.remove(image);
  }

  async getImage(id: string): Promise<Image> {
    const image = await this.findById(id);
    if (!image)
      throw new HttpException('Image is not found', HttpStatus.NOT_FOUND);
    return image;
  }

  async findById(id: string): Promise<Image> {
    return await this.repository.findOneBy({ id });
  }
}
