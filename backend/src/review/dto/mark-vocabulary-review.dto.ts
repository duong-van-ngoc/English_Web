import { IsIn } from 'class-validator';

export class MarkVocabularyReviewDto {
  @IsIn(['AGAIN', 'GOOD', 'EASY'])
  result!: 'AGAIN' | 'GOOD' | 'EASY';
}
