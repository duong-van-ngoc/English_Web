import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ContentStatus } from '@prisma/client';

export class UpdateVocabularyTopicDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  slug?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsString()
  level?: string;

  @IsOptional()
  @IsEnum(ContentStatus)
  status?: ContentStatus;
}
