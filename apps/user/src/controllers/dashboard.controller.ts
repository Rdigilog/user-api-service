import { AuthGuard } from '@app/guard/auth.guard';
import { ResponsesService } from '@app/utils/services/responses.service';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CompanyService } from 'packages/repository/services/company.service';

@ApiTags('Dashboard')
@Controller('dashboard')
@UseGuards(AuthGuard)
export class DashboardController {
  constructor(
    private readonly companyService: CompanyService,
    private readonly responseService: ResponsesService,
  ) {}

  @Get()
  async dashboard() {
    try {
      const result = await this.companyService.dashboardSummary('sder', 'day');
      return this.responseService.success(result.body);
    } catch (e) {
      return this.responseService.exception(e.message);
    }
  }
}
