import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { VocabularyTopicsController } from './vocabulary-topics.controller';
import { VocabularyTopicsService } from './vocabulary-topics.service';

@Module({
  imports: [PrismaModule],
  controllers: [VocabularyTopicsController],
  providers: [VocabularyTopicsService],
})
export class VocabularyTopicsModule {}
