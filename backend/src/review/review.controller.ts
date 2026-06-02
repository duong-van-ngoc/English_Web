import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import type { ApiResponse } from '../common/interfaces/api-response.interface';
import { MarkVocabularyReviewDto } from './dto/mark-vocabulary-review.dto';
import { ReviewService } from './review.service';

@UseGuards(JwtAuthGuard)
@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get()
  async getReviewQueue(
    @CurrentUser() user: AuthenticatedUser,
    @Query('type') type?: string,
  ): Promise<
    ApiResponse<Awaited<ReturnType<ReviewService['getReviewQueue']>>>
  > {
    const reviewQueue = await this.reviewService.getReviewQueue(user.id, type);

    return {
      success: true,
      message: 'Review queue fetched successfully',
      data: reviewQueue,
    };
  }

  @Post('vocabulary/:vocabularyId/mark')
  async markVocabularyReview(
    @CurrentUser() user: AuthenticatedUser,
    @Param('vocabularyId') vocabularyId: string,
    @Body() dto: MarkVocabularyReviewDto,
  ): Promise<
    ApiResponse<Awaited<ReturnType<ReviewService['markVocabularyReview']>>>
  > {
    const review = await this.reviewService.markVocabularyReview(
      user.id,
      vocabularyId,
      dto,
    );

    return {
      success: true,
      message: 'Vocabulary review marked successfully',
      data: review,
    };
  }

  @Post('toeic-questions/:questionId/resolve')
  async resolveToeicWrongQuestion(
    @CurrentUser() user: AuthenticatedUser,
    @Param('questionId') questionId: string,
  ): Promise<
    ApiResponse<Awaited<ReturnType<ReviewService['resolveToeicWrongQuestion']>>>
  > {
    const result = await this.reviewService.resolveToeicWrongQuestion(
      user.id,
      questionId,
    );

    return {
      success: true,
      message: 'TOEIC wrong question resolved successfully',
      data: result,
    };
  }
}
