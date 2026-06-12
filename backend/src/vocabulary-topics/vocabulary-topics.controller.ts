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
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import type { ApiResponse } from '../common/interfaces/api-response.interface';
import { VocabularyTopicsService } from './vocabulary-topics.service';
import { CreateVocabularyTopicDto } from './dto/create-vocabulary-topic.dto';
import { UpdateVocabularyTopicDto } from './dto/update-vocabulary-topic.dto';
import { CreateTopicWordDto } from './dto/create-topic-word.dto';
import { UpdateTopicWordDto } from './dto/update-topic-word.dto';
import { CreateQuizAttemptDto } from './dto/create-quiz-attempt.dto';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { ReviewStatus } from '@prisma/client';

class ReviewWordDto {
  @IsEnum(ReviewStatus)
  status!: ReviewStatus;

  @IsOptional()
  @IsNumber()
  easeLevel?: number;

  @IsOptional()
  @IsString()
  note?: string;
}

@Controller()
export class VocabularyTopicsController {
  constructor(private readonly service: VocabularyTopicsService) {}

  // ==========================================
  // ADMIN TOPIC ENDPOINTS
  // ==========================================

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('admin/courses/:courseId/vocabulary-topics')
  async findAllAdmin(
    @Param('courseId') courseId: string,
    @Query('moduleId') moduleId?: string,
  ): Promise<ApiResponse<any>> {
    const data = await this.service.findAllAdmin(courseId, moduleId);
    return { success: true, message: 'Fetched admin vocabulary topics', data };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('admin/vocabulary-topics/:topicId')
  async findOneAdmin(
    @Param('topicId') topicId: string,
  ): Promise<ApiResponse<any>> {
    const data = await this.service.findOneAdmin(topicId);
    return { success: true, message: 'Fetched admin vocabulary topic details', data };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('admin/courses/:courseId/vocabulary-topics')
  async create(
    @Param('courseId') courseId: string,
    @Body() dto: CreateVocabularyTopicDto,
  ): Promise<ApiResponse<any>> {
    const data = await this.service.create(courseId, dto);
    return { success: true, message: 'Created vocabulary topic', data };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch('admin/vocabulary-topics/reorder')
  async reorderTopics(
    @Body('topicIds') topicIds: string[],
  ): Promise<ApiResponse<any>> {
    const data = await this.service.reorder(topicIds);
    return { success: true, message: 'Reordered topics', data };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch('admin/vocabulary-topics/:topicId')
  async update(
    @Param('topicId') topicId: string,
    @Body() dto: UpdateVocabularyTopicDto,
  ): Promise<ApiResponse<any>> {
    const data = await this.service.update(topicId, dto);
    return { success: true, message: 'Updated vocabulary topic', data };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete('admin/vocabulary-topics/:topicId')
  async remove(
    @Param('topicId') topicId: string,
  ): Promise<ApiResponse<any>> {
    const data = await this.service.remove(topicId);
    return { success: true, message: 'Soft deleted vocabulary topic', data };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch('admin/vocabulary-topics/:topicId/publish')
  async publishTopic(
    @Param('topicId') topicId: string,
  ): Promise<ApiResponse<any>> {
    const data = await this.service.publish(topicId);
    return { success: true, message: 'Published vocabulary topic', data };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch('admin/vocabulary-topics/:topicId/unpublish')
  async unpublishTopic(
    @Param('topicId') topicId: string,
  ): Promise<ApiResponse<any>> {
    const data = await this.service.unpublish(topicId);
    return { success: true, message: 'Unpublished vocabulary topic', data };
  }

  // ==========================================
  // ADMIN WORD ENDPOINTS
  // ==========================================

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('admin/vocabulary-topics/:topicId/words')
  async findWordsAdmin(
    @Param('topicId') topicId: string,
  ): Promise<ApiResponse<any>> {
    const data = await this.service.findWordsAdmin(topicId);
    return { success: true, message: 'Fetched admin vocabulary words', data };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('admin/vocabulary/:wordId')
  async findOneWordAdmin(
    @Param('wordId') wordId: string,
  ): Promise<ApiResponse<any>> {
    const data = await this.service.findOneWordAdmin(wordId);
    return { success: true, message: 'Fetched admin vocabulary word details', data };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('admin/vocabulary-topics/:topicId/words')
  async createWord(
    @Param('topicId') topicId: string,
    @Body() dto: CreateTopicWordDto,
  ): Promise<ApiResponse<any>> {
    const data = await this.service.createWord(topicId, dto);
    return { success: true, message: 'Created vocabulary word', data };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch('admin/vocabulary/reorder')
  async reorderWords(
    @Body('wordIds') wordIds: string[],
  ): Promise<ApiResponse<any>> {
    const data = await this.service.reorderWords(wordIds);
    return { success: true, message: 'Reordered words', data };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch('admin/vocabulary/:wordId')
  async updateWord(
    @Param('wordId') wordId: string,
    @Body() dto: UpdateTopicWordDto,
  ): Promise<ApiResponse<any>> {
    const data = await this.service.updateWord(wordId, dto);
    return { success: true, message: 'Updated vocabulary word', data };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete('admin/vocabulary/:wordId')
  async removeWord(
    @Param('wordId') wordId: string,
  ): Promise<ApiResponse<any>> {
    const data = await this.service.removeWord(wordId);
    return { success: true, message: 'Soft deleted vocabulary word', data };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch('admin/vocabulary/:wordId/publish')
  async publishWord(
    @Param('wordId') wordId: string,
  ): Promise<ApiResponse<any>> {
    const data = await this.service.publishWord(wordId);
    return { success: true, message: 'Published vocabulary word', data };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch('admin/vocabulary/:wordId/unpublish')
  async unpublishWord(
    @Param('wordId') wordId: string,
  ): Promise<ApiResponse<any>> {
    const data = await this.service.unpublishWord(wordId);
    return { success: true, message: 'Unpublished vocabulary word', data };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch('admin/vocabulary-topics/:topicId/words/publish-all')
  async publishAllWords(
    @Param('topicId') topicId: string,
  ): Promise<ApiResponse<any>> {
    const data = await this.service.publishAllWords(topicId);
    return { success: true, message: 'Published all draft vocabulary words in this topic', data };
  }

  // ==========================================
  // USER ENDPOINTS
  // ==========================================

  @UseGuards(JwtAuthGuard)
  @Get('courses/:courseId/vocabulary-topics')
  async findAllUser(
    @CurrentUser() user: AuthenticatedUser,
    @Param('courseId') courseId: string,
  ): Promise<ApiResponse<any>> {
    const data = await this.service.findAllUser(user.id, courseId);
    return { success: true, message: 'Fetched user vocabulary topics', data };
  }

  @UseGuards(JwtAuthGuard)
  @Get('courses/:courseId/vocabulary-topics/:topicSlug/words')
  async findWordsUser(
    @CurrentUser() user: AuthenticatedUser,
    @Param('courseId') courseId: string,
    @Param('topicSlug') topicSlug: string,
  ): Promise<ApiResponse<any>> {
    const data = await this.service.findWordsUser(user.id, courseId, topicSlug);
    return { success: true, message: 'Fetched user vocabulary words', data };
  }

  @UseGuards(JwtAuthGuard)
  @Post('vocabulary/:wordId/review')
  async reviewWord(
    @CurrentUser() user: AuthenticatedUser,
    @Param('wordId') wordId: string,
    @Body() dto: ReviewWordDto,
  ): Promise<ApiResponse<any>> {
    const data = await this.service.reviewWord(user.id, wordId, dto.status, dto.easeLevel, dto.note);
    return { success: true, message: 'Updated word review progress', data };
  }

  @UseGuards(JwtAuthGuard)
  @Post('vocabulary/:wordId/favorite')
  async favoriteWord(
    @CurrentUser() user: AuthenticatedUser,
    @Param('wordId') wordId: string,
  ): Promise<ApiResponse<any>> {
    const data = await this.service.favoriteWord(user.id, wordId, true);
    return { success: true, message: 'Favorited word', data };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('vocabulary/:wordId/favorite')
  async unfavoriteWord(
    @CurrentUser() user: AuthenticatedUser,
    @Param('wordId') wordId: string,
  ): Promise<ApiResponse<any>> {
    const data = await this.service.favoriteWord(user.id, wordId, false);
    return { success: true, message: 'Unfavorited word', data };
  }

  @UseGuards(JwtAuthGuard)
  @Post('courses/:courseId/vocabulary-topics/quiz/attempt')
  async createQuizAttempt(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateQuizAttemptDto,
  ): Promise<ApiResponse<any>> {
    const data = await this.service.createQuizAttempt(user.id, dto);
    return { success: true, message: 'Created vocabulary quiz attempt', data };
  }

  @UseGuards(JwtAuthGuard)
  @Get('courses/:courseId/vocabulary-topics/quiz/attempts/:attemptId')
  async getQuizAttempt(
    @CurrentUser() user: AuthenticatedUser,
    @Param('attemptId') attemptId: string,
  ): Promise<ApiResponse<any>> {
    const data = await this.service.getQuizAttempt(user.id, attemptId);
    return { success: true, message: 'Fetched vocabulary quiz attempt details', data };
  }

  @UseGuards(JwtAuthGuard)
  @Get('courses/:courseId/vocabulary-topics/quiz/attempts')
  async getQuizAttempts(
    @CurrentUser() user: AuthenticatedUser,
    @Param('courseId') courseId: string,
  ): Promise<ApiResponse<any>> {
    const data = await this.service.getQuizAttempts(user.id, courseId);
    return { success: true, message: 'Fetched user vocabulary quiz attempts', data };
  }

  @UseGuards(JwtAuthGuard)
  @Post('vocabulary/:wordId/note')
  async updateWordNote(
    @CurrentUser() user: AuthenticatedUser,
    @Param('wordId') wordId: string,
    @Body('note') note: string,
  ): Promise<ApiResponse<any>> {
    const data = await this.service.updateWordNote(user.id, wordId, note);
    return { success: true, message: 'Updated word personal note', data };
  }
}
