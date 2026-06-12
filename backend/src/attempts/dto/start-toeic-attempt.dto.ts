import { IsNotEmpty, IsString } from 'class-validator';

export class StartToeicAttemptDto {
  @IsString()
  @IsNotEmpty()
  questionSetId!: string;
}
