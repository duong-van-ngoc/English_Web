import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateQuizAttemptDto {
  @IsString()
  @IsNotEmpty()
  topicId!: string;

  @IsString()
  @IsNotEmpty()
  topicName!: string;

  @IsNumber()
  score!: number;

  @IsNumber()
  correctCount!: number;

  @IsNumber()
  wrongCount!: number;

  @IsBoolean()
  isPassed!: boolean;

  @IsArray()
  wrongAnswers!: any[];
}
