import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserValidation } from 'src/auth/types/user-validation.type';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { VinylRecord } from '../vinyl-record/vinyl-record.entity';
import { ImageService } from '../image/image.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
    private readonly imageService: ImageService,
  ) {}

  async createUser(userData: UserValidation): Promise<User> {
    const image = await this.imageService.saveImageFromUrl(userData.avatar);
    return await this.repository.save({ ...userData, avatar: image });
  }

  async findByEmail(email: string): Promise<User> {
    return await this.repository.findOneBy({ email });
  }

  async findById(id: string): Promise<User> {
    return await this.repository.findOneBy({ id });
  }

  async getProfile(userId: string): Promise<User> {
    return await this.repository.findOne({
      where: { id: userId },
      relations: { purchases: true, reviews: true, avatar: true },
    });
  }

  async updateProfile(
    userId: string,
    profileData: UpdateProfileDto,
  ): Promise<User> {
    await this.repository.save({ id: userId, ...profileData });
    return await this.repository.findOne({
      where: { id: userId },
      relations: { avatar: true },
    });
  }

  async updateProfileWithAvatar(
    userId: string,
    profileData: UpdateProfileDto,
    file: Express.Multer.File,
  ): Promise<User> {
    const user = await this.repository.findOne({
      where: { id: userId },
      relations: { avatar: true },
    });
    const image = await this.imageService.saveImage(file);
    await this.repository.save({
      id: userId,
      ...profileData,
      avatar: image,
    });
    return await this.repository.findOne({
      where: { id: userId },
      relations: { avatar: true },
    });
  }

  async deleteProfile(userId: string): Promise<User> {
    const user = await this.repository.findOne({
      where: { id: userId },
    });
    return await this.repository.remove(user);
  }

  async addPurchase(userId: string, vinylRecord: VinylRecord): Promise<void> {
    const user = await this.repository.findOne({
      where: { id: userId },
      relations: { purchases: true },
    });
    user.purchases.push(vinylRecord);
    this.repository.save(user);
  }
}
