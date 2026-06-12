import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';

@Injectable()
export class ModulesService {
  constructor(private readonly prisma: PrismaService) {}

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

  async findPublishedByCourse(courseIdOrSlug: string) {
    const resolvedCourseId = await this.resolveCourseId(courseIdOrSlug);

    return this.prisma.module.findMany({
      where: {
        courseId: resolvedCourseId,
        isPublished: true,
      },
      orderBy: {
        order: 'asc',
      },
    });
  }

  async findAdminByCourse(courseIdOrSlug: string) {
    const resolvedCourseId = await this.resolveCourseId(courseIdOrSlug);

    return this.prisma.module.findMany({
      where: {
        courseId: resolvedCourseId,
      },
      orderBy: {
        order: 'asc',
      },
    });
  }

  async create(courseIdOrSlug: string, dto: CreateModuleDto) {
    const resolvedCourseId = await this.resolveCourseId(courseIdOrSlug);

    let nextOrder = dto.order;
    if (nextOrder === undefined) {
      const maxOrderModule = await this.prisma.module.findFirst({
        where: { courseId: resolvedCourseId },
        orderBy: { order: 'desc' },
      });
      nextOrder = maxOrderModule ? maxOrderModule.order + 1 : 1;
    }

    try {
      return await this.prisma.module.create({
        data: {
          courseId: resolvedCourseId,
          title: dto.title,
          slug: dto.slug,
          description: dto.description,
          type: dto.type,
          icon: dto.icon,
          order: nextOrder,
          isPublished: dto.isPublished !== undefined ? dto.isPublished : true,
        },
      });
    } catch (error: any) {
      if (error && typeof error === 'object' && error.code === 'P2002') {
        throw new ConflictException(
          `Module with slug "${dto.slug}" already exists in this course.`,
        );
      }
      throw error;
    }
  }

  async update(courseIdOrSlug: string, moduleId: string, dto: UpdateModuleDto) {
    const resolvedCourseId = await this.resolveCourseId(courseIdOrSlug);

    const module = await this.prisma.module.findFirst({
      where: {
        id: moduleId,
        courseId: resolvedCourseId,
      },
    });

    if (!module) {
      throw new NotFoundException(
        `Module with ID "${moduleId}" not found in this course.`,
      );
    }

    try {
      return await this.prisma.module.update({
        where: { id: moduleId },
        data: {
          title: dto.title,
          slug: dto.slug,
          description: dto.description,
          type: dto.type,
          icon: dto.icon,
          order: dto.order,
          isPublished: dto.isPublished,
        },
      });
    } catch (error: any) {
      if (error && typeof error === 'object' && error.code === 'P2002') {
        throw new ConflictException(
          `Module with slug "${dto.slug}" already exists in this course.`,
        );
      }
      throw error;
    }
  }

  async remove(courseIdOrSlug: string, moduleId: string) {
    const resolvedCourseId = await this.resolveCourseId(courseIdOrSlug);

    const module = await this.prisma.module.findFirst({
      where: {
        id: moduleId,
        courseId: resolvedCourseId,
      },
    });

    if (!module) {
      throw new NotFoundException(
        `Module with ID "${moduleId}" not found in this course.`,
      );
    }

    return this.prisma.module.delete({
      where: { id: moduleId },
    });
  }

  async reorder(courseIdOrSlug: string, moduleIds: string[]) {
    const resolvedCourseId = await this.resolveCourseId(courseIdOrSlug);

    // Verify all moduleIds belong to the specified course
    const count = await this.prisma.module.count({
      where: {
        courseId: resolvedCourseId,
        id: { in: moduleIds },
      },
    });

    if (count !== moduleIds.length) {
      throw new BadRequestException(
        'Some modules are invalid or do not belong to this course.',
      );
    }

    await this.prisma.$transaction(
      moduleIds.map((id, index) =>
        this.prisma.module.update({
          where: { id },
          data: { order: index + 1 },
        }),
      ),
    );

    return { success: true };
  }
}
