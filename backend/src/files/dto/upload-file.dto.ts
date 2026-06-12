import { FileKind } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class UploadFileDto {
  @IsEnum(FileKind)
  kind!: FileKind;
}
