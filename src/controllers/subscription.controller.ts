import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiQuery,
  ApiOperation,
  ApiExtraModels,
  ApiOkResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { AuthUser } from 'src/decorators/logged-in-user-decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { UpdateSubscriptionUsersDto } from 'src/models/plans/plan.dto';
import {
  ApiResponseDto,
  PaginatedResponse,
} from 'src/models/responses/generic.dto';
import { InvoiceDto, SubscriptionDto } from 'src/models/responses/subscription';
import type { LoggedInUser } from 'src/models/types/user.types';
import { SubscriptionService } from 'src/services/subscription.service';
import { ResponsesService } from 'src/utils/services/responses.service';

@ApiTags('Subscriptions')
@Controller('subscription')
@ApiBearerAuth('access-token') // allow using access token with swagger()
@UseGuards(AuthGuard)
export class SubscriptionController {
  constructor(
    private readonly service: SubscriptionService,
    private readonly responseService: ResponsesService,
  ) {}

  @ApiExtraModels(ApiResponseDto, InvoiceDto, PaginatedResponse)
  @ApiOkResponse({
    description: 'Billing History',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ApiResponseDto) },
        {
          properties: {
            data: {
              allOf: [
                { $ref: getSchemaPath(PaginatedResponse) },
                {
                  properties: {
                    result: {
                      type: 'array',
                      items: { $ref: getSchemaPath(InvoiceDto) },
                    },
                  },
                },
              ],
            },
          },
        },
      ],
    },
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'size', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'sortDirection', required: false, type: String })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @Get('/billing-history')
  async list(
    @AuthUser() user: LoggedInUser,
    @Query('page') page: number = 1,
    @Query('size') size: number = 50,
    @Query('search') search?: string,
    @Query('sortDirection') sortDirection?: 'asc' | 'desc',
    @Query('sortBy') sortBy?: string,
  ) {
    try {
      const result = await this.service.companyBillingHistory(
        user.userRole[0].companyId as string,
        page,
        size,
        search,
        sortBy,
        sortDirection,
      );
      if (result.error == 2) {
        return this.responseService.exception(result.body);
      }
      return this.responseService.success(result.body);
    } catch (e) {
      return this.responseService.exception(e.message);
    }
  }

  @ApiOkResponse({
    description: 'Company current subscription',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ApiResponseDto) },
        {
          properties: {
            data: { $ref: getSchemaPath(SubscriptionDto) },
          },
        },
      ],
    },
  })
  @Get()
  async companySubscription(@AuthUser() user: LoggedInUser) {
    try {
      const result = await this.service.companySubscription(
        user.userRole[0].companyId as string,
      );
      if (result.error == 2) {
        return this.responseService.notFound('company has no subscription');
      }
      return this.responseService.success(result.body);
    } catch (e) {
      return this.responseService.exception(e.message);
    }
  }

  @Patch('')
  @ApiOperation({
    summary: 'Update a company total number of users for subscription',
    description:
      'This endpoint updates the total number of users assigned to a specific company. The value must be an integer greater than or equal to zero.',
  })
  async updateUserSubscription(
    @AuthUser() user: LoggedInUser,
    @Body() payload: UpdateSubscriptionUsersDto,
  ) {
    try {
      const result = await this.service.addUsers(
        user.userRole[0].companyId as string,
        payload,
      );
      if (result.error == 2) {
        return this.responseService.exception(result.body);
      }
      return this.responseService.success(result.body);
    } catch (e) {
      return this.responseService.exception(e.message);
    }
  }

  @Post('cancel')
  @ApiOperation({
    summary: 'Update a company total number of users for subscription',
    description:
      'This endpoint updates the total number of users assigned to a specific company. The value must be an integer greater than or equal to zero.',
  })
  async cancelSubscription(@AuthUser() user: LoggedInUser) {
    try {
      const result = await this.service.cancelSubscription(
        user.userRole[0].companyId as string,
      );
      if (result.error == 2) {
        return this.responseService.exception(result.body);
      }
      return this.responseService.success(result.body);
    } catch (e) {
      return this.responseService.exception(e.message);
    }
  }
}
