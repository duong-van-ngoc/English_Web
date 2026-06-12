import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserRole, type Lesson } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UpdateContentStatusDto } from '../common/dto/update-content-status.dto';
import type { ApiResponse } from '../common/interfaces/api-response.interface';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { LessonsService } from './lessons.service';

@Controller()
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Get('courses/:courseId/lessons')
  async findByCourse(
    @Param('courseId') courseId: string,
    @Query('moduleId') moduleId?: string,
  ): Promise<ApiResponse<Lesson[]>> {
    const lessons = await this.lessonsService.findByCourse(courseId, moduleId);

    return {
      success: true,
      message: 'Lessons fetched successfully',
      data: lessons,
    };
  }

  @Get('lessons/:id')
  async findOne(@Param('id') id: string): Promise<ApiResponse<Lesson>> {
    const lesson = await this.lessonsService.findOne(id);

    return {
      success: true,
      message: 'Lesson fetched successfully',
      data: lesson,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('courses/:courseId/lessons')
  async create(
    @Param('courseId') courseId: string,
    @Body() createLessonDto: CreateLessonDto,
  ): Promise<ApiResponse<Lesson>> {
    const lesson = await this.lessonsService.create(courseId, createLessonDto);

    return {
      success: true,
      message: 'Lesson created successfully',
      data: lesson,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch('lessons/:id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateContentStatusDto,
  ): Promise<ApiResponse<Lesson>> {
    const lesson = await this.lessonsService.updateStatus(
      id,
      updateStatusDto.status,
    );

    return {
      success: true,
      message: 'Lesson status updated successfully',
      data: lesson,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch('lessons/:id')
  async update(
    @Param('id') id: string,
    @Body() updateLessonDto: UpdateLessonDto,
  ): Promise<ApiResponse<Lesson>> {
    const lesson = await this.lessonsService.update(id, updateLessonDto);

    return {
      success: true,
      message: 'Lesson updated successfully',
      data: lesson,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete('lessons/:id')
  async remove(@Param('id') id: string): Promise<ApiResponse<Lesson>> {
    const lesson = await this.lessonsService.remove(id);

    return {
      success: true,
      message: 'Lesson deleted successfully',
      data: lesson,
    };
  }
}
