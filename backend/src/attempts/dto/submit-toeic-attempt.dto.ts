import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

class SubmitToeicAttemptAnswerDto {
  @IsString()
  @IsNotEmpty()
  questionId!: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  selectedChoiceId?: string | null;
}

export class SubmitToeicAttemptDto {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => SubmitToeicAttemptAnswerDto)
  answers!: SubmitToeicAttemptAnswerDto[];
}
