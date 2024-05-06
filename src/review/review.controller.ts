import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { Review } from './review.entity';
import { ReqUser } from '../common/req-user.decorator';
import { UpdateReviewDto } from './dto/update-review.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { AccessRoles } from '../common/roles.decorator';
import { Roles } from '../user/roles.enum';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}
  @ApiTags('Allowed role: User', 'Allowed role: Admin')
  @AccessRoles([Roles.User, Roles.Admin])
  @ApiOperation({ summary: 'Get reviews by vinyl record ID' })
  @ApiOkResponse({
    description: 'Returns reviews for the specified vinyl record ID',
    type: [Review],
  })
  @ApiParam({ name: 'id', description: 'Vinyl record ID', type: 'uuid' })
  @Get('vinyl-record/:id')
  async getReviews(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Query() paginationParams: PaginationDto,
  ): Promise<Review[]> {
    return await this.reviewService.getReviews(id, paginationParams);
  }

  @ApiTags('Allowed role: User')
  @AccessRoles([Roles.User])
  @ApiOperation({ summary: 'Create a new review' })
  @ApiCreatedResponse({
    description: 'Returns created review',
    type: Review,
  })
  @ApiParam({ name: 'id', description: 'Vinyl record ID', type: 'uuid' })
  @ApiBody({ type: CreateReviewDto })
  @Post('vinyl-record/:id')
  async createReview(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: CreateReviewDto,
    @ReqUser('id') userId: string,
  ): Promise<Review> {
    return await this.reviewService.createReview(userId, id, body);
  }

  @ApiTags('Allowed role: Admin')
  @AccessRoles([Roles.Admin])
  @ApiOperation({ summary: 'Delete a review by ID' })
  @ApiOkResponse({
    description: 'Returns the deleted review',
    type: Review,
  })
  @ApiParam({ name: 'id', description: 'Review ID', type: 'uuid' })
  @Delete(':id')
  async deleteReview(
    @Param('id', new ParseUUIDPipe()) id: string,
    @ReqUser('id') userId: string,
  ): Promise<Review> {
    return await this.reviewService.deleteReview(id, userId);
  }

  @ApiOperation({ summary: 'Edit reviews by review ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns edited reviews',
    type: Review,
  })
  @ApiParam({ name: 'id', description: 'Review`s ID', type: 'uuid' })
  @ApiBody({ type: UpdateReviewDto })
  @ApiTags('Allowed role: User')
  @AccessRoles([Roles.User])
  @Patch(':id')
  async editReview(
    @Body() body: UpdateReviewDto,
    @Param('id', new ParseUUIDPipe()) id: string,
    @ReqUser('id') userId: string,
  ): Promise<Review> {
    return await this.reviewService.editReview(body, id, userId);
  }
}
