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
import { UserRole, type Vocabulary } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import type { ApiResponse } from '../common/interfaces/api-response.interface';
import { CreateVocabularyDto } from './dto/create-vocabulary.dto';
import { UpdateVocabularyDto } from './dto/update-vocabulary.dto';
import { VocabularyService } from './vocabulary.service';

@Controller()
export class VocabularyController {
  constructor(private readonly vocabularyService: VocabularyService) {}

  @Get('lessons/:lessonId/vocabulary')
  async findByLesson(
    @Param('lessonId') lessonId: string,
  ): Promise<ApiResponse<Vocabulary[]>> {
    const vocabulary = await this.vocabularyService.findByLesson(lessonId);

    return {
      success: true,
      message: 'Vocabulary fetched successfully',
      data: vocabulary,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('lessons/:lessonId/vocabulary')
  async create(
    @Param('lessonId') lessonId: string,
    @Body() createVocabularyDto: CreateVocabularyDto,
  ): Promise<ApiResponse<Vocabulary>> {
    const vocabulary = await this.vocabularyService.create(
      lessonId,
      createVocabularyDto,
    );

    return {
      success: true,
      message: 'Vocabulary created successfully',
      data: vocabulary,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch('vocabulary/:id')
  async update(
    @Param('id') id: string,
    @Body() updateVocabularyDto: UpdateVocabularyDto,
  ): Promise<ApiResponse<Vocabulary>> {
    const vocabulary = await this.vocabularyService.update(
      id,
      updateVocabularyDto,
    );

    return {
      success: true,
      message: 'Vocabulary updated successfully',
      data: vocabulary,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete('vocabulary/:id')
  async remove(@Param('id') id: string): Promise<ApiResponse<Vocabulary>> {
    const vocabulary = await this.vocabularyService.remove(id);

    return {
      success: true,
      message: 'Vocabulary deleted successfully',
      data: vocabulary,
    };
  }
}
