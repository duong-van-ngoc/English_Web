import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class QuestionAnswerDto {
  @IsString()
  @IsNotEmpty()
  content!: string;

  @IsOptional()
  @IsBoolean()
  isCorrect?: boolean;
}
