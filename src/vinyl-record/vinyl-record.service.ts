import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VinylRecord } from './vinyl-record.entity';
import { FindOptionsOrder, FindOptionsWhere, Repository } from 'typeorm';
import { CreateVinylRecordDto } from './dto/create-vinyl-record.dto';
import { ReviewService } from '../review/review.service';
import { VinylRecordResponse } from './types/vinyl-record-response.type';
import { VinylRecordQueryDto } from './dto/vinyl-record-query.dto';
import { Client as Discogs } from 'disconnect';
import { ConfigService } from '@nestjs/config';
import { RequestUser } from '../user/types/request-user.type';
import { Roles } from 'src/user/roles.enum';
import { ImageService } from '../image/image.service';
import { UpdateVinylRecordDto } from './dto/edit-vinyl-record.dto';

@Injectable()
export class VinylRecordService {
  discogs: Discogs;
  constructor(
    @InjectRepository(VinylRecord)
    private readonly repository: Repository<VinylRecord>,
    private readonly reviewService: ReviewService,
    private readonly configService: ConfigService,
    private readonly imageService: ImageService,
  ) {
    this.discogs = new Discogs({
      userToken: this.configService.get('DISCOGS_TOKEN'),
    }).database();
  }

  async addVinylRecordFromDiscogs(
    id: number,
    userId: string,
    price: number,
  ): Promise<VinylRecord> {
    try {
      const data = await this.discogs.getRelease(id);
      const image = await this.imageService.saveImageFromUrl(
        data.images[0].resource_url,
      );
      return await this.repository.save(
        {
          description: `Realesed in ${data.released}. Genre: ${data.genres[0]}, style: ${data.styles[0]}.`,
          name: data.title,
          authorName: data.artists[0].name,
          price,
          image: image,
        },
        { data: userId },
      );
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async addVinylRecord(
    createDto: CreateVinylRecordDto,
    userId: string,
    file: Express.Multer.File,
  ): Promise<VinylRecord> {
    const image = await this.imageService.saveImage(file);
    return await this.repository.save(
      {
        ...createDto,
        image,
      },
      { data: userId },
    );
  }

  async updateVinylRecord(
    id: string,
    editDto: UpdateVinylRecordDto,
    userId: string,
  ): Promise<VinylRecord> {
    const vinylRecord = await this.findById(id);
    if (!vinylRecord)
      throw new HttpException(
        'Vinyl record is not found',
        HttpStatus.NOT_FOUND,
      );
    await this.repository.save({ id, ...editDto }, { data: userId });
    return await this.findByIdWithImage(id);
  }

  async updateVinylRecordWithImage(
    id: string,
    editDto: UpdateVinylRecordDto,
    userId: string,
    file: Express.Multer.File,
  ): Promise<VinylRecord> {
    const vinylRecord = await this.findByIdWithImage(id);
    if (!vinylRecord)
      throw new HttpException(
        'Vinyl record is not found',
        HttpStatus.NOT_FOUND,
      );
    const image = await this.imageService.saveImage(file);
    await this.repository.save({ id, ...editDto, image }, { data: userId });
    this.imageService.deleteImage(vinylRecord.image.id);
    return await this.findByIdWithImage(id);
  }

  async deleteVinylRecord(id: string, userId: string): Promise<VinylRecord> {
    const vinylRecord = await this.repository.findOneBy({ id });
    if (!vinylRecord)
      throw new HttpException(
        'Vinyl record is not found',
        HttpStatus.NOT_FOUND,
      );
    return await this.repository.remove(vinylRecord, { data: userId });
  }

  async getAllVinylRecords(
    queryParams: VinylRecordQueryDto,
    user: RequestUser,
  ): Promise<VinylRecordResponse[]> {
    let sortOptions: FindOptionsOrder<VinylRecord>;
    let searchOptions: FindOptionsWhere<VinylRecord>;
    if (user && user.role === Roles.User) {
      sortOptions = { [queryParams.sort]: queryParams.order };
      searchOptions = {
        ...queryParams.getFilteringParams(),
      };
    }
    const vinylRecords = await this.repository.find({
      order: sortOptions,
      skip: queryParams.getOffset(),
      take: queryParams.limit,
      where: searchOptions,
      relations: { image: true },
    });
    return await Promise.all(
      vinylRecords.map((record) => this.extendVinylRecordWithReview(record)),
    );
  }

  private async extendVinylRecordWithReview(
    vinylRecord: VinylRecord,
  ): Promise<VinylRecordResponse> {
    const review = await this.reviewService.findEarliestReview(vinylRecord.id);
    const score = await this.reviewService.getAvgScore(vinylRecord.id);
    return {
      ...vinylRecord,
      image: vinylRecord.image.id,
      review: review || {},
      avgscore: score ? +score.toFixed(2) : null,
    };
  }

  async findById(id: string): Promise<VinylRecord> {
    return await this.repository.findOneBy({ id });
  }

  async findByIdWithImage(id: string): Promise<VinylRecord> {
    return await this.repository.findOne({
      where: { id },
      relations: { image: true },
    });
  }
}
