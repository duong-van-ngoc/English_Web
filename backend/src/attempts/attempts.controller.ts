import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import type { Attempt, AttemptAnswer, Question } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import type { ApiResponse } from '../common/interfaces/api-response.interface';
import { AttemptsService } from './attempts.service';
import { CreateAttemptDto } from './dto/create-attempt.dto';
import { StartToeicAttemptDto } from './dto/start-toeic-attempt.dto';
import { SubmitToeicAttemptDto } from './dto/submit-toeic-attempt.dto';

type AttemptWithAnswers = Attempt & {
  answers: Array<
    AttemptAnswer & {
      question: Question;
    }
  >;
};

@UseGuards(JwtAuthGuard)
@Controller()
export class AttemptsController {
  constructor(private readonly attemptsService: AttemptsService) {}

  @Post('attempts')
  async startToeicAttempt(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: StartToeicAttemptDto,
  ): Promise<
    ApiResponse<Awaited<ReturnType<AttemptsService['startToeicAttempt']>>>
  > {
    const attempt = await this.attemptsService.startToeicAttempt(user.id, dto);

    return {
      success: true,
      message: 'TOEIC attempt started successfully',
      data: attempt,
    };
  }

  @Get('attempts/history')
  async getToeicHistory(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<
    ApiResponse<Awaited<ReturnType<AttemptsService['getToeicHistory']>>>
  > {
    const history = await this.attemptsService.getToeicHistory(user.id);

    return {
      success: true,
      message: 'TOEIC attempt history fetched successfully',
      data: history,
    };
  }

  @Post('attempts/:id/submit')
  async submitToeicAttempt(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: SubmitToeicAttemptDto,
  ): Promise<
    ApiResponse<Awaited<ReturnType<AttemptsService['submitToeicAttempt']>>>
  > {
    const result = await this.attemptsService.submitToeicAttempt(
      user.id,
      id,
      dto,
    );

    return {
      success: true,
      message: 'TOEIC attempt submitted successfully',
      data: result,
    };
  }

  @Get('attempts/:id/result')
  async getToeicResult(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ): Promise<
    ApiResponse<Awaited<ReturnType<AttemptsService['getToeicResult']>>>
  > {
    const result = await this.attemptsService.getToeicResult(user.id, id);

    return {
      success: true,
      message: 'TOEIC attempt result fetched successfully',
      data: result,
    };
  }

  @Get('users/:userId/attempts')
  async findByUser(
    @Param('userId') userId: string,
  ): Promise<ApiResponse<AttemptWithAnswers[]>> {
    const attempts = await this.attemptsService.findByUser(userId);

    return {
      success: true,
      message: 'Attempts fetched successfully',
      data: attempts,
    };
  }

  @Get('attempts/:id')
  async findOne(
    @Param('id') id: string,
  ): Promise<ApiResponse<AttemptWithAnswers>> {
    const attempt = await this.attemptsService.findOne(id);

    return {
      success: true,
      message: 'Attempt fetched successfully',
      data: attempt,
    };
  }

  @Post('users/:userId/attempts')
  async create(
    @Param('userId') userId: string,
    @Body() createAttemptDto: CreateAttemptDto,
  ): Promise<ApiResponse<AttemptWithAnswers>> {
    const attempt = await this.attemptsService.create(userId, createAttemptDto);

    return {
      success: true,
      message: 'Attempt created successfully',
      data: attempt,
    };
  }

  @Delete('attempts/:id')
  async remove(
    @Param('id') id: string,
  ): Promise<ApiResponse<AttemptWithAnswers>> {
    const attempt = await this.attemptsService.remove(id);

    return {
      success: true,
      message: 'Attempt deleted successfully',
      data: attempt,
    };
  }
}
