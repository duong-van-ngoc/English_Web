import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';
import { CoursesModule } from './courses/courses.module';
import { PrismaModule } from './prisma/prisma.module';
import { LessonsModule } from './lessons/lessons.module';
import { VocabularyModule } from './vocabulary/vocabulary.module';
import { QuestionsModule } from './questions/questions.module';
import { ProgressModule } from './progress/progress.module';
import { AttemptsModule } from './attempts/attempts.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { PracticeModule } from './practice/practice.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ReviewModule } from './review/review.module';
import { FilesModule } from './files/files.module';
import { VocabularyTopicsModule } from './vocabulary-topics/vocabulary-topics.module';

/**
 * AppModule
 *
 * Nhiệm vụ:
 * - Module gốc của backend.
 * - Import các feature module như HealthModule và CoursesModule.
 */
@Module({
  imports: [
    PrismaModule,
    HealthModule,
    CoursesModule,
    LessonsModule,
    VocabularyModule,
    QuestionsModule,
    ProgressModule,
    AttemptsModule,
    AuthModule,
    AdminModule,
    PracticeModule,
    DashboardModule,
    ReviewModule,
    FilesModule,
    VocabularyTopicsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
