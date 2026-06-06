import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name: string;

  @IsInt()
  @IsOptional()
  toeicGoal?: number;

  @IsString()
  @IsOptional()
  @IsEnum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED'])
  level?: string;

  @IsString()
  @IsOptional()
  avatarUrl?: string;
}
