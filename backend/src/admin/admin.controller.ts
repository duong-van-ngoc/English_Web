import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import type { ApiResponse } from '../common/interfaces/api-response.interface';
import { AdminService } from './admin.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('summary')
  async getSummary(): Promise<ApiResponse<unknown>> {
    const summary = await this.adminService.getSummary();

    return {
      success: true,
      message: 'Admin summary fetched successfully',
      data: summary,
    };
  }

  @Get('courses')
  async findCourses(
    @Query('search') search?: string,
    @Query('status') status?: string,
  ): Promise<ApiResponse<unknown>> {
    const courses = await this.adminService.findCourses(search, status);

    return {
      success: true,
      message: 'Admin courses fetched successfully',
      data: courses,
    };
  }

  @Get('courses/:id')
  async findCourse(@Param('id') id: string): Promise<ApiResponse<unknown>> {
    const course = await this.adminService.findCourse(id);

    return {
      success: true,
      message: 'Admin course fetched successfully',
      data: course,
    };
  }

  @Get('lessons')
  async findLessons(
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('courseId') courseId?: string,
  ): Promise<ApiResponse<unknown>> {
    const lessons = await this.adminService.findLessons(
      search,
      status,
      courseId,
    );

    return {
      success: true,
      message: 'Admin lessons fetched successfully',
      data: lessons,
    };
  }

  @Get('lessons/:id')
  async findLesson(@Param('id') id: string): Promise<ApiResponse<unknown>> {
    const lesson = await this.adminService.findLesson(id);

    return {
      success: true,
      message: 'Admin lesson fetched successfully',
      data: lesson,
    };
  }

  @Get('questions')
  async findQuestions(
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('lessonId') lessonId?: string,
  ): Promise<ApiResponse<unknown>> {
    const questions = await this.adminService.findQuestions(
      search,
      status,
      lessonId,
    );

    return {
      success: true,
      message: 'Admin questions fetched successfully',
      data: questions,
    };
  }

  @Get('questions/:id')
  async findQuestion(@Param('id') id: string): Promise<ApiResponse<unknown>> {
    const question = await this.adminService.findQuestion(id);

    return {
      success: true,
      message: 'Admin question fetched successfully',
      data: question,
    };
  }

  @Get('vocabulary')
  async findVocabulary(
    @Query('search') search?: string,
    @Query('lessonId') lessonId?: string,
  ): Promise<ApiResponse<unknown>> {
    const vocabulary = await this.adminService.findVocabulary(search, lessonId);

    return {
      success: true,
      message: 'Admin vocabulary fetched successfully',
      data: vocabulary,
    };
  }

  @Get('vocabulary/:id')
  async findVocabularyItem(
    @Param('id') id: string,
  ): Promise<ApiResponse<unknown>> {
    const vocabulary = await this.adminService.findVocabularyItem(id);

    return {
      success: true,
      message: 'Admin vocabulary item fetched successfully',
      data: vocabulary,
    };
  }
}
