import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ContentStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import {
  COURSE_LEVELS,
  type Course,
  type CourseLevel,
} from './interfaces/course.interface';

@Injectable()
export class CoursesService {
  private readonly adminCourseInclude = {
    lessons: {
      orderBy: {
        order: 'asc' as const,
      },
    },
  };
  private readonly publicCourseInclude = {
    lessons: {
      where: {
        status: ContentStatus.PUBLISHED,
      },
      orderBy: {
        order: 'asc' as const,
      },
    },
  };

  constructor(private readonly prisma: PrismaService) {}

  async findAll(level?: string): Promise<Course[]> {
    if (level && !this.isCourseLevel(level)) {
      throw new BadRequestException(
        `Invalid level. Allowed values: ${COURSE_LEVELS.join(', ')}`,
      );
    }

    return this.prisma.course.findMany({
      where: {
        status: ContentStatus.PUBLISHED,
        ...(level ? { level } : {}),
      },
      include: this.publicCourseInclude,
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async findOne(id: string): Promise<Course> {
    const course = await this.prisma.course.findFirst({
      where: {
        id,
        status: ContentStatus.PUBLISHED,
      },
      include: this.publicCourseInclude,
    });

    if (!course) {
      throw new NotFoundException(`Course with id "${id}" not found`);
    }

    return course;
  }

  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    const slug = await this.createUniqueSlug(
      createCourseDto.slug ?? createCourseDto.title,
    );

    try {
      return await this.prisma.course.create({
        data: {
          title: createCourseDto.title,
          slug,
          level: createCourseDto.level,
          description: createCourseDto.description,
        },
        include: this.adminCourseInclude,
      });
    } catch (error) {
      this.handleCourseWriteError(error, slug);
    }
  }

  async update(id: string, updateCourseDto: UpdateCourseDto): Promise<Course> {
    const slug =
      updateCourseDto.slug !== undefined
        ? await this.createUniqueSlug(updateCourseDto.slug, id)
        : undefined;

    try {
      return await this.prisma.course.update({
        where: {
          id,
        },
        data: {
          title: updateCourseDto.title,
          level: updateCourseDto.level,
          description: updateCourseDto.description,
          ...(slug ? { slug } : {}),
        },
        include: this.adminCourseInclude,
      });
    } catch (error) {
      this.handleCourseWriteError(error, slug);
    }
  }

  async remove(id: string): Promise<Course> {
    try {
      return await this.prisma.course.delete({
        where: {
          id,
        },
        include: this.adminCourseInclude,
      });
    } catch (error) {
      this.handleCourseWriteError(error);
    }
  }

  async updateStatus(id: string, status: ContentStatus): Promise<Course> {
    const course = await this.prisma.course.findUnique({
      where: {
        id,
      },
      include: {
        lessons: {
          where: {
            status: ContentStatus.PUBLISHED,
          },
          select: {
            id: true,
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (status === ContentStatus.PUBLISHED && course.lessons.length === 0) {
      throw new BadRequestException(
        'Course must have at least one published lesson before publishing',
      );
    }

    return this.prisma.course.update({
      where: {
        id,
      },
      data: {
        status,
        publishedAt: status === ContentStatus.PUBLISHED ? new Date() : null,
      },
      include: this.adminCourseInclude,
    });
  }

  private async createUniqueSlug(
    value: string,
    excludeCourseId?: string,
  ): Promise<string> {
    const baseSlug = this.slugify(value);
    const existingCourses = await this.prisma.course.findMany({
      where: {
        slug: {
          startsWith: baseSlug,
        },
        ...(excludeCourseId
          ? {
              NOT: {
                id: excludeCourseId,
              },
            }
          : {}),
      },
      select: {
        slug: true,
      },
    });
    const existingSlugs = new Set(
      existingCourses.map((course) => course.slug.toLowerCase()),
    );

    if (!existingSlugs.has(baseSlug)) {
      return baseSlug;
    }

    let suffix = 2;

    while (existingSlugs.has(`${baseSlug}-${suffix}`)) {
      suffix += 1;
    }

    return `${baseSlug}-${suffix}`;
  }

  private slugify(value: string): string {
    const normalized = value
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    if (!normalized) {
      throw new BadRequestException('Course slug cannot be empty');
    }

    return normalized;
  }

  private isCourseLevel(level: string): level is CourseLevel {
    return COURSE_LEVELS.includes(level as CourseLevel);
  }

  private handleCourseWriteError(error: unknown, slug?: string): never {
    if (this.isPrismaKnownRequestError(error)) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Course not found');
      }

      if (error.code === 'P2002') {
        throw new ConflictException(
          slug
            ? `Course slug "${slug}" already exists`
            : 'Course already exists',
        );
      }
    }

    throw error;
  }

  private isPrismaKnownRequestError(error: unknown): error is { code: string } {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      typeof error.code === 'string'
    );
  }
}
