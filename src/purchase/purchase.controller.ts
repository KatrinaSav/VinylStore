import { Body, Controller, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { AccessRoles } from '../common/roles.decorator';
import { Roles } from '../user/roles.enum';
import { PurchaseService } from './purchase.service';
import { ReqUser } from '../common/req-user.decorator';
import { Paycheck } from './types/paycheck.type';
import {
  ApiOperation,
  ApiParam,
  ApiPaymentRequiredResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('purchase')
@Controller('purchase')
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  @ApiOperation({ summary: 'Purchase the vinyl-record' })
  @ApiPaymentRequiredResponse({ description: 'Payment required' })
  @ApiParam({ name: 'id', description: 'Vinyl-record ID', type: 'uuid' })
  @ApiTags('Allowed role: User')
  @AccessRoles([Roles.User])
  @Post('vinyl-record/:id')
  async purchaseVinylRecord(
    @Param('id', new ParseUUIDPipe()) id: string,
    @ReqUser('id') userId: string,
    @Body('cardToken') cardToken: string,
  ): Promise<Paycheck> {
    return await this.purchaseService.purchaseVinylRecord(
      id,
      userId,
      cardToken,
    );
  }
}
