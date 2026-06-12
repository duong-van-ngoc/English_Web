import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AttemptAnswerDto {
  @IsString()
  @IsNotEmpty()
  questionId!: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  answerId?: string;
}
