import { Controller, Get, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import type { ApiResponse } from '../common/interfaces/api-response.interface';
import { DashboardService } from './dashboard.service';

@UseGuards(JwtAuthGuard)
@Controller()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('dashboard')
  async getDashboard(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<
    ApiResponse<Awaited<ReturnType<DashboardService['getDashboard']>>>
  > {
    const dashboard = await this.dashboardService.getDashboard(user);

    return {
      success: true,
      message: 'Dashboard fetched successfully',
      data: dashboard,
    };
  }

  @Get('stats')
  async getStats(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<ApiResponse<Awaited<ReturnType<DashboardService['getStats']>>>> {
    const stats = await this.dashboardService.getStats(user.id);

    return {
      success: true,
      message: 'Stats fetched successfully',
      data: stats,
    };
  }
}
