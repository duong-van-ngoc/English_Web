import { IsOptional, IsString } from 'class-validator';

export class UpdateToeicQuestionGroupMediaDto {
  @IsOptional()
  @IsString()
  audioUrl?: string | null;

  @IsOptional()
  @IsString()
  imageUrl?: string | null;

  @IsOptional()
  @IsString()
  transcript?: string | null;
}
