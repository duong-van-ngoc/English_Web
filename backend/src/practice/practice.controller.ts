import { Controller, Get, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { ApiResponse } from '../common/interfaces/api-response.interface';
import { PracticeService } from './practice.service';

@Controller('practice')
export class PracticeController {
  constructor(private readonly practiceService: PracticeService) {}

  @Get('parts')
  getParts(): ApiResponse<ReturnType<PracticeService['getParts']>> {
    return {
      success: true,
      message: 'TOEIC parts fetched successfully',
      data: this.practiceService.getParts(),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('question-sets')
  async getQuestionSets(
    @Query('part') part?: string,
  ): Promise<ApiResponse<Awaited<ReturnType<PracticeService['getQuestionSets']>>>> {
    const questionSets = await this.practiceService.getQuestionSets(
      part ? Number(part) : undefined,
    );

    return {
      success: true,
      message: 'TOEIC question sets fetched successfully',
      data: questionSets,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('question-sets/:id')
  async getQuestionSet(
    @Param('id') id: string,
  ): Promise<ApiResponse<Awaited<ReturnType<PracticeService['getQuestionSet']>>>> {
    const questionSet = await this.practiceService.getQuestionSet(id);

    return {
      success: true,
      message: 'TOEIC question set fetched successfully',
      data: questionSet,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('questions')
  async getQuestionsByPart(
    @Query('part', ParseIntPipe) part: number,
  ): Promise<
    ApiResponse<Awaited<ReturnType<PracticeService['getFirstQuestionSetByPart']>>>
  > {
    const questionSet = await this.practiceService.getFirstQuestionSetByPart(part);

    return {
      success: true,
      message: 'TOEIC questions fetched successfully',
      data: questionSet,
    };
  }
}
