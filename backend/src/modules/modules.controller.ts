import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import type { ApiResponse } from '../common/interfaces/api-response.interface';
import { ModulesService } from './modules.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { ReorderModulesDto } from './dto/reorder-modules.dto';

@Controller()
export class ModulesController {
  constructor(private readonly service: ModulesService) {}

  @UseGuards(JwtAuthGuard)
  @Get('courses/:courseId/modules')
  async findPublishedByCourse(
    @Param('courseId') courseId: string,
  ): Promise<ApiResponse<any>> {
    const data = await this.service.findPublishedByCourse(courseId);
    return {
      success: true,
      message: 'Fetched published modules successfully',
      data,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('admin/courses/:courseId/modules')
  async findAdminByCourse(
    @Param('courseId') courseId: string,
  ): Promise<ApiResponse<any>> {
    const data = await this.service.findAdminByCourse(courseId);
    return {
      success: true,
      message: 'Fetched all course modules for admin',
      data,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('admin/courses/:courseId/modules')
  async create(
    @Param('courseId') courseId: string,
    @Body() dto: CreateModuleDto,
  ): Promise<ApiResponse<any>> {
    const data = await this.service.create(courseId, dto);
    return {
      success: true,
      message: 'Created course module successfully',
      data,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch('admin/courses/:courseId/modules/reorder')
  async reorder(
    @Param('courseId') courseId: string,
    @Body() dto: ReorderModulesDto,
  ): Promise<ApiResponse<any>> {
    const data = await this.service.reorder(courseId, dto.moduleIds);
    return {
      success: true,
      message: 'Reordered course modules successfully',
      data,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch('admin/courses/:courseId/modules/:moduleId')
  async update(
    @Param('courseId') courseId: string,
    @Param('moduleId') moduleId: string,
    @Body() dto: UpdateModuleDto,
  ): Promise<ApiResponse<any>> {
    const data = await this.service.update(courseId, moduleId, dto);
    return {
      success: true,
      message: 'Updated course module successfully',
      data,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete('admin/courses/:courseId/modules/:moduleId')
  async remove(
    @Param('courseId') courseId: string,
    @Param('moduleId') moduleId: string,
  ): Promise<ApiResponse<any>> {
    const data = await this.service.remove(courseId, moduleId);
    return {
      success: true,
      message: 'Deleted course module successfully',
      data,
    };
  }
}
