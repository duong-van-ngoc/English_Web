import { ArrayNotEmpty, IsArray, IsString } from 'class-validator';

export class ReorderModulesDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  moduleIds!: string[];
}
