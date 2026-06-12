import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const TOEIC_PARTS = [
  {
    part: 1,
    title: 'Photographs',
    description: 'Look at a picture and choose the correct statement.',
  },
  {
    part: 2,
    title: 'Question Response',
    description: 'Listen to a question and choose the best response.',
  },
  {
    part: 3,
    title: 'Conversations',
    description: 'Listen to a conversation and answer related questions.',
  },
  {
    part: 4,
    title: 'Talks',
    description: 'Listen to a short talk and answer related questions.',
  },
  {
    part: 5,
    title: 'Incomplete Sentences',
    description: 'Choose the best answer to complete each sentence.',
  },
  {
    part: 6,
    title: 'Text Completion',
    description: 'Complete missing words or phrases in short texts.',
  },
  {
    part: 7,
    title: 'Reading Comprehension',
    description: 'Read passages and answer comprehension questions.',
  },
] as const;

@Injectable()
export class PracticeService {
  constructor(private readonly prisma: PrismaService) {}

  getParts() {
    return TOEIC_PARTS;
  }

  async getQuestionSets(part?: number) {
    if (part !== undefined) {
      this.ensureValidPart(part);
    }

    return this.prisma.toeicQuestionSet.findMany({
      where: {
        ...(part ? { part } : {}),
        type: 'PRACTICE',
      },
      select: {
        id: true,
        title: true,
        description: true,
        part: true,
        type: true,
        duration: true,
        version: true,
        _count: {
          select: {
            groups: true,
          },
        },
      },
      orderBy: [{ part: 'asc' }, { createdAt: 'asc' }],
    });
  }

  async getQuestionSet(id: string) {
    const questionSet = await this.prisma.toeicQuestionSet.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        title: true,
        description: true,
        part: true,
        type: true,
        duration: true,
        version: true,
        groups: {
          select: {
            id: true,
            title: true,
            audioUrl: true,
            imageUrl: true,
            passageContent: true,
            transcript: true,
            order: true,
            questions: {
              select: {
                id: true,
                content: true,
                order: true,
                choices: {
                  select: {
                    id: true,
                    label: true,
                    content: true,
                  },
                  orderBy: {
                    label: 'asc',
                  },
                },
              },
              orderBy: {
                order: 'asc',
              },
            },
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    if (!questionSet) {
      throw new NotFoundException(`TOEIC question set "${id}" not found`);
    }

    return questionSet;
  }

  async getFirstQuestionSetByPart(part: number) {
    this.ensureValidPart(part);

    const questionSet = await this.prisma.toeicQuestionSet.findFirst({
      where: {
        part,
        type: 'PRACTICE',
      },
      orderBy: {
        createdAt: 'asc',
      },
      select: {
        id: true,
      },
    });

    if (!questionSet) {
      throw new NotFoundException(
        `No TOEIC practice set found for part ${part}`,
      );
    }

    return this.getQuestionSet(questionSet.id);
  }

  private ensureValidPart(part: number): void {
    if (!Number.isInteger(part) || part < 1 || part > 7) {
      throw new BadRequestException('TOEIC part must be a number from 1 to 7');
    }
  }
}
