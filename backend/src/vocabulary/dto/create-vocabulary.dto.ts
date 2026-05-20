import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateVocabularyDto {
  @IsString()
  @IsNotEmpty()
  word!: string;

  @IsString()
  @IsNotEmpty()
  meaning!: string;

  @IsOptional()
  @IsString()
  phonetic?: string;

  @IsOptional()
  @IsString()
  example?: string;

  @IsOptional()
  @IsString()
  audioUrl?: string;
}
