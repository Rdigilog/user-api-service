import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AuthUser } from 'src/decorators/logged-in-user-decorator';
import { AuthGuard } from 'src/guards/auth.guard';
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
}
