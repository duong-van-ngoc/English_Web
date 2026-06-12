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
import { UserRole } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UpdateContentStatusDto } from '../common/dto/update-content-status.dto';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import type { ApiResponse, Course } from './interfaces/course.interface';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  async findAll(
    @Query('level') level?: string,
  ): Promise<ApiResponse<Course[]>> {
    const courses = await this.coursesService.findAll(level);

    return {
      success: true,
      message: 'Courses fetched successfully',
      data: courses,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ApiResponse<Course>> {
    const course = await this.coursesService.findOne(id);

    return {
      success: true,
      message: 'Course fetched successfully',
      data: course,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  async create(
    @Body() createCourseDto: CreateCourseDto,
  ): Promise<ApiResponse<Course>> {
    const course = await this.coursesService.create(createCourseDto);

    return {
      success: true,
      message: 'Course created successfully',
      data: course,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateContentStatusDto,
  ): Promise<ApiResponse<Course>> {
    const course = await this.coursesService.updateStatus(
      id,
      updateStatusDto.status,
    );

    return {
      success: true,
      message: 'Course status updated successfully',
      data: course,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ): Promise<ApiResponse<Course>> {
    const course = await this.coursesService.update(id, updateCourseDto);

    return {
      success: true,
      message: 'Course updated successfully',
      data: course,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<ApiResponse<Course>> {
    const course = await this.coursesService.remove(id);

    return {
      success: true,
      message: 'Course deleted successfully',
      data: course,
    };
  }
}
