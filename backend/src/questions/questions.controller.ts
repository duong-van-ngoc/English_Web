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
import { UserRole, type Answer, type Question } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UpdateContentStatusDto } from '../common/dto/update-content-status.dto';
import type { ApiResponse } from '../common/interfaces/api-response.interface';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { QuestionsService } from './questions.service';

type QuestionWithAnswers = Question & {
  answers: Answer[];
};

@Controller()
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Get('lessons/:lessonId/questions')
  async findByLesson(
    @Param('lessonId') lessonId: string,
  ): Promise<ApiResponse<QuestionWithAnswers[]>> {
    const questions = await this.questionsService.findByLesson(lessonId);

    return {
      success: true,
      message: 'Questions fetched successfully',
      data: questions,
    };
  }

  @Get('questions/:id')
  async findOne(
    @Param('id') id: string,
  ): Promise<ApiResponse<QuestionWithAnswers>> {
    const question = await this.questionsService.findOne(id);

    return {
      success: true,
      message: 'Question fetched successfully',
      data: question,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('lessons/:lessonId/questions')
  async create(
    @Param('lessonId') lessonId: string,
    @Body() createQuestionDto: CreateQuestionDto,
  ): Promise<ApiResponse<QuestionWithAnswers>> {
    const question = await this.questionsService.create(
      lessonId,
      createQuestionDto,
    );

    return {
      success: true,
      message: 'Question created successfully',
      data: question,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch('questions/:id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateContentStatusDto,
  ): Promise<ApiResponse<QuestionWithAnswers>> {
    const question = await this.questionsService.updateStatus(
      id,
      updateStatusDto.status,
    );

    return {
      success: true,
      message: 'Question status updated successfully',
      data: question,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch('questions/:id')
  async update(
    @Param('id') id: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ): Promise<ApiResponse<QuestionWithAnswers>> {
    const question = await this.questionsService.update(id, updateQuestionDto);

    return {
      success: true,
      message: 'Question updated successfully',
      data: question,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete('questions/:id')
  async remove(@Param('id') id: string): Promise<ApiResponse<Question>> {
    const question = await this.questionsService.remove(id);

    return {
      success: true,
      message: 'Question deleted successfully',
      data: question,
    };
  }
}
