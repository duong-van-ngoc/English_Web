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
import type { Course, Lesson, Progress } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { ApiResponse } from '../common/interfaces/api-response.interface';
import { CreateProgressDto } from './dto/create-progress.dto';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { ProgressService } from './progress.service';

type ProgressWithRelations = Progress & {
  course: Course;
  lesson: Lesson | null;
};

@UseGuards(JwtAuthGuard)
@Controller()
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get('users/:userId/progress')
  async findByUser(
    @Param('userId') userId: string,
  ): Promise<ApiResponse<ProgressWithRelations[]>> {
    const progress = await this.progressService.findByUser(userId);

    return {
      success: true,
      message: 'Progress fetched successfully',
      data: progress,
    };
  }

  @Get('progress/:id')
  async findOne(
    @Param('id') id: string,
  ): Promise<ApiResponse<ProgressWithRelations>> {
    const progress = await this.progressService.findOne(id);

    return {
      success: true,
      message: 'Progress fetched successfully',
      data: progress,
    };
  }

  @Post('users/:userId/progress')
  async create(
    @Param('userId') userId: string,
    @Body() createProgressDto: CreateProgressDto,
  ): Promise<ApiResponse<ProgressWithRelations>> {
    const progress = await this.progressService.create(
      userId,
      createProgressDto,
    );

    return {
      success: true,
      message: 'Progress created successfully',
      data: progress,
    };
  }

  @Patch('progress/:id')
  async update(
    @Param('id') id: string,
    @Body() updateProgressDto: UpdateProgressDto,
  ): Promise<ApiResponse<ProgressWithRelations>> {
    const progress = await this.progressService.update(id, updateProgressDto);

    return {
      success: true,
      message: 'Progress updated successfully',
      data: progress,
    };
  }

  @Delete('progress/:id')
  async remove(
    @Param('id') id: string,
  ): Promise<ApiResponse<ProgressWithRelations>> {
    const progress = await this.progressService.remove(id);

    return {
      success: true,
      message: 'Progress deleted successfully',
      data: progress,
    };
  }
}
