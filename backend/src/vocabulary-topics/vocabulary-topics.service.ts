import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ContentStatus, ReviewStatus, ModuleType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVocabularyTopicDto } from './dto/create-vocabulary-topic.dto';
import { UpdateVocabularyTopicDto } from './dto/update-vocabulary-topic.dto';
import { CreateTopicWordDto } from './dto/create-topic-word.dto';
import { UpdateTopicWordDto } from './dto/update-topic-word.dto';
import { CreateQuizAttemptDto } from './dto/create-quiz-attempt.dto';

@Injectable()
export class VocabularyTopicsService {
  constructor(private readonly prisma: PrismaService) { }

  // ==========================================
  // ADMIN TOPIC METHODS
  // ==========================================

  async findAllAdmin(courseIdOrSlug?: string, moduleId?: string) {
    let resolvedCourseId: string | undefined;

    if (courseIdOrSlug) {
      resolvedCourseId = await this.resolveCourseId(courseIdOrSlug);
    }

    return this.prisma.vocabularyTopic.findMany({
      where: {
        deletedAt: null,
        ...(resolvedCourseId ? { courseId: resolvedCourseId } : {}),
        ...(moduleId ? { moduleId } : {}),
      },
      include: {
        _count: {
          select: { vocabularies: { where: { deletedAt: null } } },
        },
      },
      orderBy: {
        order: 'asc',
      },
    });
  }

  async findOneAdmin(topicId: string) {
    return this.ensureTopicExists(topicId);
  }

  async create(courseIdOrSlug: string, dto: CreateVocabularyTopicDto) {
    const courseId = await this.resolveCourseId(courseIdOrSlug);
    const slug = dto.slug ? this.slugify(dto.slug) : this.slugify(dto.name);

    // Check if slug is unique within this course (including soft-deleted ones)
    const existing = await this.prisma.vocabularyTopic.findFirst({
      where: {
        courseId,
        slug,
      },
    });

    if (existing) {
      if (existing.deletedAt !== null) {
        // Giải phóng slug bị trùng lặp của bản ghi cũ đã bị xóa mềm
        await this.prisma.vocabularyTopic.update({
          where: { id: existing.id },
          data: { slug: `${existing.slug}-deleted-${Date.now()}` },
        });
      } else {
        throw new ConflictException(`Topic slug "${slug}" already exists in this course.`);
      }
    }

    // Get max order
    const maxOrderTopic = await this.prisma.vocabularyTopic.findFirst({
      where: { courseId, deletedAt: null },
      orderBy: { order: 'desc' },
    });
    const order = maxOrderTopic ? maxOrderTopic.order + 1 : 1;

    return this.prisma.vocabularyTopic.create({
      data: {
        courseId,
        moduleId: dto.moduleId || null,
        name: dto.name,
        slug,
        description: dto.description,
        imageUrl: dto.imageUrl,
        icon: dto.icon,
        level: dto.level,
        order,
        status: dto.status || ContentStatus.DRAFT,
      },
    });
  }

  async update(topicId: string, dto: UpdateVocabularyTopicDto) {
    const topic = await this.ensureTopicExists(topicId);

    let slug = topic.slug;
    if (dto.slug !== undefined || dto.name !== undefined) {
      const prospectiveSlug = dto.slug ? this.slugify(dto.slug) : this.slugify(dto.name || topic.name);

      if (prospectiveSlug !== topic.slug) {
        // Check uniqueness
        const existing = await this.prisma.vocabularyTopic.findFirst({
          where: {
            courseId: topic.courseId,
            slug: prospectiveSlug,
            id: { not: topicId },
          },
        });
        if (existing) {
          if (existing.deletedAt !== null) {
            // Giải phóng slug của bản ghi cũ đã bị xóa mềm
            await this.prisma.vocabularyTopic.update({
              where: { id: existing.id },
              data: { slug: `${existing.slug}-deleted-${Date.now()}` },
            });
          } else {
            throw new ConflictException(`Topic slug "${prospectiveSlug}" already exists in this course.`);
          }
        }
        slug = prospectiveSlug;
      }
    }

    return this.prisma.vocabularyTopic.update({
      where: { id: topicId },
      data: {
        name: dto.name,
        slug,
        description: dto.description,
        imageUrl: dto.imageUrl,
        icon: dto.icon,
        level: dto.level,
        status: dto.status,
        moduleId: dto.moduleId !== undefined ? dto.moduleId : undefined,
      },
    });
  }

  async remove(topicId: string) {
    await this.ensureTopicExists(topicId);

    // Soft delete topic and its words
    await this.prisma.vocabulary.updateMany({
      where: { topicId },
      data: { deletedAt: new Date() },
    });

    return this.prisma.vocabularyTopic.update({
      where: { id: topicId },
      data: { deletedAt: new Date() },
    });
  }

  async publish(topicId: string) {
    await this.ensureTopicExists(topicId);

    // Rule: Must have at least 1 published word to publish the topic
    const publishedWordsCount = await this.prisma.vocabulary.count({
      where: {
        topicId,
        status: ContentStatus.PUBLISHED,
        deletedAt: null,
      },
    });

    if (publishedWordsCount === 0) {
      throw new BadRequestException('Topic must have at least one published word before publishing.');
    }

    return this.prisma.vocabularyTopic.update({
      where: { id: topicId },
      data: { status: ContentStatus.PUBLISHED },
    });
  }

  async unpublish(topicId: string) {
    await this.ensureTopicExists(topicId);

    return this.prisma.vocabularyTopic.update({
      where: { id: topicId },
      data: { status: ContentStatus.DRAFT },
    });
  }

  async reorder(topicIds: string[]) {
    await this.prisma.$transaction(
      topicIds.map((id, index) =>
        this.prisma.vocabularyTopic.update({
          where: { id },
          data: { order: index + 1 },
        }),
      ),
    );
    return { success: true };
  }

  // ==========================================
  // ADMIN WORD METHODS
  // ==========================================

  async findWordsAdmin(topicId: string) {
    await this.ensureTopicExists(topicId);

    return this.prisma.vocabulary.findMany({
      where: {
        topicId,
        deletedAt: null,
      },
      orderBy: {
        order: 'asc',
      },
    });
  }

  async findOneWordAdmin(wordId: string) {
    return this.ensureWordExists(wordId);
  }

  async createWord(topicId: string, dto: CreateTopicWordDto) {
    await this.ensureTopicExists(topicId);

    // Check if word is duplicate in this topic
    const existing = await this.prisma.vocabulary.findFirst({
      where: {
        topicId,
        word: dto.word,
        deletedAt: null,
      },
    });

    if (existing) {
      throw new ConflictException(`Word "${dto.word}" already exists in this topic.`);
    }

    // Get max order
    const maxOrderWord = await this.prisma.vocabulary.findFirst({
      where: { topicId, deletedAt: null },
      orderBy: { order: 'desc' },
    });
    const order = maxOrderWord ? maxOrderWord.order + 1 : 1;

    return this.prisma.vocabulary.create({
      data: {
        topicId,
        word: dto.word,
        meaning: dto.meaning,
        phonetic: dto.phonetic,
        partOfSpeech: dto.partOfSpeech,
        example: dto.example,
        exampleVi: dto.exampleVi,
        audioUrl: dto.audioUrl,
        imageUrl: dto.imageUrl,
        level: dto.level,
        difficulty: dto.difficulty,
        order,
        status: dto.status || ContentStatus.DRAFT,
        tags: dto.tags || [],
        synonyms: dto.synonyms || [],
        collocations: dto.collocations || [],
        wordFamily: dto.wordFamily || [],
        commonMistakes: dto.commonMistakes || [],
      },
    });
  }

  async updateWord(wordId: string, dto: UpdateTopicWordDto) {
    const word = await this.ensureWordExists(wordId);

    if (dto.word !== undefined && dto.word !== word.word) {
      // Check duplicate in same topic
      const existing = await this.prisma.vocabulary.findFirst({
        where: {
          topicId: word.topicId,
          word: dto.word,
          id: { not: wordId },
          deletedAt: null,
        },
      });
      if (existing) {
        throw new ConflictException(`Word "${dto.word}" already exists in this topic.`);
      }
    }

    return this.prisma.vocabulary.update({
      where: { id: wordId },
      data: {
        word: dto.word,
        meaning: dto.meaning,
        phonetic: dto.phonetic,
        partOfSpeech: dto.partOfSpeech,
        example: dto.example,
        exampleVi: dto.exampleVi,
        audioUrl: dto.audioUrl,
        imageUrl: dto.imageUrl,
        level: dto.level,
        difficulty: dto.difficulty,
        status: dto.status,
        tags: dto.tags,
        synonyms: dto.synonyms,
        collocations: dto.collocations,
        wordFamily: dto.wordFamily,
        commonMistakes: dto.commonMistakes,
      },
    });
  }

  async removeWord(wordId: string) {
    await this.ensureWordExists(wordId);

    return this.prisma.vocabulary.update({
      where: { id: wordId },
      data: { deletedAt: new Date() },
    });
  }

  async publishWord(wordId: string) {
    await this.ensureWordExists(wordId);
    return this.prisma.vocabulary.update({
      where: { id: wordId },
      data: { status: ContentStatus.PUBLISHED },
    });
  }

  async unpublishWord(wordId: string) {
    await this.ensureWordExists(wordId);
    return this.prisma.vocabulary.update({
      where: { id: wordId },
      data: { status: ContentStatus.DRAFT },
    });
  }

  async publishAllWords(topicId: string) {
    await this.ensureTopicExists(topicId);

    // Cập nhật tất cả các từ của topicId có trạng thái DRAFT thành PUBLISHED
    const result = await this.prisma.vocabulary.updateMany({
      where: {
        topicId,
        status: ContentStatus.DRAFT,
        deletedAt: null,
      },
      data: {
        status: ContentStatus.PUBLISHED,
      },
    });

    return { count: result.count };
  }

  async reorderWords(wordIds: string[]) {
    await this.prisma.$transaction(
      wordIds.map((id, index) =>
        this.prisma.vocabulary.update({
          where: { id },
          data: { order: index + 1 },
        }),
      ),
    );
    return { success: true };
  }

  // ==========================================
  // USER TOPIC & PROGRESS METHODS
  // ==========================================

  async findAllUser(userId: string, courseIdOrSlug: string) {
    // Determine course by ID or slug
    const course = await this.prisma.course.findFirst({
      where: {
        OR: [{ id: courseIdOrSlug }, { slug: courseIdOrSlug }],
      },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const vocabModule = await this.prisma.module.findFirst({
      where: {
        courseId: course.id,
        type: ModuleType.VOCABULARY,
      },
    });

    const topics = await this.prisma.vocabularyTopic.findMany({
      where: {
        courseId: course.id,
        status: ContentStatus.PUBLISHED,
        deletedAt: null,
        ...(vocabModule
          ? {
              OR: [
                { moduleId: vocabModule.id },
                { moduleId: null },
              ],
            }
          : {}),
      },
      orderBy: {
        order: 'asc',
      },
      include: {
        vocabularies: {
          where: {
            status: ContentStatus.PUBLISHED,
            deletedAt: null,
          },
          include: {
            reviews: {
              where: {
                userId,
              },
            },
          },
        },
      },
    });

    return topics.map((topic) => {
      const totalWords = topic.vocabularies.length;
      const masteredCount = topic.vocabularies.filter(
        (v) => v.reviews[0]?.status === ReviewStatus.MASTERED,
      ).length;
      const progressPercent = totalWords > 0 ? Math.round((masteredCount / totalWords) * 100) : 0;

      return {
        id: topic.id,
        courseId: topic.courseId,
        name: topic.name,
        slug: topic.slug,
        description: topic.description,
        imageUrl: topic.imageUrl,
        icon: topic.icon,
        level: topic.level,
        order: topic.order,
        wordCount: totalWords,
        masteredCount,
        progressPercent,
        status: topic.status,
      };
    });
  }

  async findWordsUser(userId: string, courseIdOrSlug: string, topicSlug: string) {
    const course = await this.prisma.course.findFirst({
      where: {
        OR: [{ id: courseIdOrSlug }, { slug: courseIdOrSlug }],
      },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const topic = await this.prisma.vocabularyTopic.findFirst({
      where: {
        courseId: course.id,
        slug: topicSlug,
        status: ContentStatus.PUBLISHED,
        deletedAt: null,
      },
    });

    if (!topic) {
      throw new NotFoundException('Topic not found');
    }

    const words = await this.prisma.vocabulary.findMany({
      where: {
        topicId: topic.id,
        status: ContentStatus.PUBLISHED,
        deletedAt: null,
      },
      orderBy: {
        order: 'asc',
      },
      include: {
        reviews: {
          where: {
            userId,
          },
        },
      },
    });

    const wordsResult = words.map((w) => {
      const userReview = w.reviews[0];
      return {
        id: w.id,
        word: w.word,
        meaning: w.meaning,
        phonetic: w.phonetic,
        partOfSpeech: w.partOfSpeech,
        example: w.example,
        exampleVi: w.exampleVi,
        audioUrl: w.audioUrl,
        imageUrl: w.imageUrl,
        level: w.level,
        difficulty: w.difficulty,
        tags: w.tags,
        synonyms: w.synonyms,
        collocations: w.collocations,
        wordFamily: w.wordFamily,
        commonMistakes: w.commonMistakes,
        isFavorite: userReview?.isFavorite || false,
        reviewStatus: userReview?.status || null,
        note: userReview?.note || null,
      };
    });

    return {
      topic: {
        id: topic.id,
        name: topic.name,
        slug: topic.slug,
        description: topic.description,
        icon: topic.icon,
      },
      words: wordsResult,
    };
  }

  async reviewWord(userId: string, wordId: string, status: ReviewStatus, easeLevel: number = 0, note?: string) {
    const word = await this.prisma.vocabulary.findFirst({
      where: { id: wordId, deletedAt: null },
    });

    if (!word) {
      throw new NotFoundException('Word not found');
    }

    const masteredAt = status === ReviewStatus.MASTERED ? new Date() : null;

    // Spaced Repetition simple calculation
    let nextReviewAt: Date | null = new Date();
    if (status === ReviewStatus.MASTERED) {
      nextReviewAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days later
    } else if (status === ReviewStatus.LEARNING) {
      nextReviewAt = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000); // 1 day later
    }

    return this.prisma.vocabularyReview.upsert({
      where: {
        userId_vocabularyId: {
          userId,
          vocabularyId: wordId,
        },
      },
      update: {
        status,
        easeLevel,
        reviewCount: { increment: 1 },
        note: note !== undefined ? note : undefined,
        masteredAt: masteredAt || undefined,
        lastReviewedAt: new Date(),
        nextReviewAt,
      },
      create: {
        userId,
        vocabularyId: wordId,
        status,
        easeLevel,
        reviewCount: 1,
        note,
        masteredAt,
        lastReviewedAt: new Date(),
        nextReviewAt,
      },
    });
  }

  async favoriteWord(userId: string, wordId: string, isFavorite: boolean) {
    const word = await this.prisma.vocabulary.findFirst({
      where: { id: wordId, deletedAt: null },
    });

    if (!word) {
      throw new NotFoundException('Word not found');
    }

    return this.prisma.vocabularyReview.upsert({
      where: {
        userId_vocabularyId: {
          userId,
          vocabularyId: wordId,
        },
      },
      update: {
        isFavorite,
      },
      create: {
        userId,
        vocabularyId: wordId,
        status: ReviewStatus.LEARNING,
        isFavorite,
      },
    });
  }

  // ==========================================
  // USER QUIZ & NOTE METHODS
  // ==========================================

  async createQuizAttempt(userId: string, dto: CreateQuizAttemptDto) {
    return this.prisma.vocabularyQuizAttempt.create({
      data: {
        userId,
        topicId: dto.topicId,
        topicName: dto.topicName,
        score: dto.score,
        correctCount: dto.correctCount,
        wrongCount: dto.wrongCount,
        isPassed: dto.isPassed,
        wrongAnswers: dto.wrongAnswers,
      },
    });
  }

  async getQuizAttempt(userId: string, attemptId: string) {
    const attempt = await this.prisma.vocabularyQuizAttempt.findFirst({
      where: {
        id: attemptId,
        userId,
      },
    });

    if (!attempt) {
      throw new NotFoundException(`Quiz attempt not found.`);
    }

    return attempt;
  }

  async getQuizAttempts(userId: string, courseIdOrSlug: string) {
    const courseId = await this.resolveCourseId(courseIdOrSlug);
    const topics = await this.prisma.vocabularyTopic.findMany({
      where: {
        courseId,
        deletedAt: null,
      },
      select: {
        id: true,
        slug: true,
      },
    });

    const topicSlugs = topics.map((t) => t.slug);
    const topicIds = topics.map((t) => t.id);

    return this.prisma.vocabularyQuizAttempt.findMany({
      where: {
        userId,
        OR: [
          { topicId: { in: topicSlugs } },
          { topicId: { in: topicIds } },
        ],
      },
      orderBy: {
        timestamp: 'desc',
      },
    });
  }

  async updateWordNote(userId: string, wordId: string, note: string) {
    const word = await this.prisma.vocabulary.findFirst({
      where: { id: wordId, deletedAt: null },
    });

    if (!word) {
      throw new NotFoundException('Word not found');
    }

    return this.prisma.vocabularyReview.upsert({
      where: {
        userId_vocabularyId: {
          userId,
          vocabularyId: wordId,
        },
      },
      update: {
        note,
      },
      create: {
        userId,
        vocabularyId: wordId,
        status: ReviewStatus.LEARNING,
        note,
      },
    });
  }

  // ==========================================
  // HELPERS
  // ==========================================

  /**
   * Resolve a course by either its CUID id or slug.
   * Throws NotFoundException if course is not found.
   */
  private async resolveCourseId(courseIdOrSlug: string): Promise<string> {
    const course = await this.prisma.course.findFirst({
      where: {
        OR: [{ id: courseIdOrSlug }, { slug: courseIdOrSlug }],
      },
      select: { id: true },
    });

    if (!course) {
      throw new NotFoundException(`Course "${courseIdOrSlug}" not found.`);
    }

    return course.id;
  }

  private async ensureTopicExists(id: string) {
    const topic = await this.prisma.vocabularyTopic.findFirst({
      where: { id, deletedAt: null },
    });
    if (!topic) {
      throw new NotFoundException(`Topic with ID "${id}" not found.`);
    }
    return topic;
  }

  private async ensureWordExists(id: string) {
    const word = await this.prisma.vocabulary.findFirst({
      where: { id, deletedAt: null },
    });
    if (!word) {
      throw new NotFoundException(`Word with ID "${id}" not found.`);
    }
    return word;
  }

  private slugify(value: string): string {
    return value
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}
