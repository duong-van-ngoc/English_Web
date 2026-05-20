import { ContentStatus } from '@prisma/client';
import { IsIn } from 'class-validator';

const CONTENT_STATUSES = Object.values(ContentStatus);

export class UpdateContentStatusDto {
  @IsIn(CONTENT_STATUSES)
  status!: ContentStatus;
}
