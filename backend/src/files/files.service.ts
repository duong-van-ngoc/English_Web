import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { FileAsset, FileKind, Prisma } from '@prisma/client';
import { randomUUID } from 'node:crypto';
import { mkdir, unlink, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { PrismaService } from '../prisma/prisma.service';
import { QueryFilesDto } from './dto/query-files.dto';

const UPLOAD_ROOT = join(process.cwd(), 'uploads');
const STORAGE_FOLDERS: Record<FileKind, string> = {
  [FileKind.AUDIO]: 'audio',
  [FileKind.IMAGE]: 'images',
};
const ACCEPTED_MIME_TYPES: Record<FileKind, string[]> = {
  [FileKind.AUDIO]: ['audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/ogg'],
  [FileKind.IMAGE]: ['image/jpeg', 'image/png', 'image/webp'],
};
const MAX_FILE_SIZE: Record<FileKind, number> = {
  [FileKind.AUDIO]: 10 * 1024 * 1024,
  [FileKind.IMAGE]: 5 * 1024 * 1024,
};

type UploadedFile = {
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
};

@Injectable()
export class FilesService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit(): Promise<void> {
    await this.ensureUploadDirectories();
  }

  async listFiles(query: QueryFilesDto) {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 24;
    const where: Prisma.FileAssetWhereInput = {
      ...(query.kind ? { kind: query.kind } : {}),
      ...(query.search
        ? {
            OR: [
              { originalName: { contains: query.search, mode: 'insensitive' } },
              { storageKey: { contains: query.search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      this.prisma.fileAsset.findMany({
        where,
        orderBy: {
          createdAt: 'desc',
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.fileAsset.count({ where }),
    ]);

    return {
      items,
      page,
      pageSize,
      total,
    };
  }

  async getFile(id: string) {
    return this.findAssetOrThrow(id);
  }

  async uploadFile(
    file: UploadedFile | undefined,
    kind: FileKind,
  ): Promise<FileAsset> {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    this.validateFile(file, kind);

    const extension = extname(file.originalname).toLowerCase();
    const fileName = `${randomUUID()}${extension}`;
    const storageKey = `${STORAGE_FOLDERS[kind]}/${fileName}`;
    const absolutePath = join(UPLOAD_ROOT, storageKey);

    await this.ensureUploadDirectories();
    await writeFile(absolutePath, file.buffer);

    return this.prisma.fileAsset.create({
      data: {
        originalName: file.originalname,
        storageKey,
        mimeType: file.mimetype,
        size: file.size,
        kind,
        url: `/${['uploads', storageKey].join('/')}`,
      },
    });
  }

  async deleteFile(id: string): Promise<FileAsset> {
    const asset = await this.findAssetOrThrow(id);
    await this.ensureFileIsNotReferenced(asset);

    await this.prisma.fileAsset.delete({
      where: { id },
    });

    await unlink(join(UPLOAD_ROOT, asset.storageKey)).catch(
      (error: NodeJS.ErrnoException) => {
        if (error.code !== 'ENOENT') {
          throw error;
        }
      },
    );

    return asset;
  }

  private async ensureUploadDirectories(): Promise<void> {
    await Promise.all(
      Object.values(STORAGE_FOLDERS).map((folder) =>
        mkdir(join(UPLOAD_ROOT, folder), { recursive: true }),
      ),
    );
  }

  private validateFile(file: UploadedFile, kind: FileKind): void {
    if (file.size <= 0) {
      throw new BadRequestException('File must not be empty');
    }

    if (!ACCEPTED_MIME_TYPES[kind].includes(file.mimetype)) {
      throw new BadRequestException(`Invalid ${kind.toLowerCase()} file type`);
    }

    if (file.size > MAX_FILE_SIZE[kind]) {
      throw new BadRequestException(
        `${kind} file size must be ${MAX_FILE_SIZE[kind]} bytes or smaller`,
      );
    }
  }

  private async ensureFileIsNotReferenced(asset: FileAsset): Promise<void> {
    const [toeicAudioGroups, toeicImageGroups, vocabularyItems] =
      await Promise.all([
        this.prisma.toeicQuestionGroup.findMany({
          where: {
            audioUrl: asset.url,
          },
          select: {
            id: true,
          },
          take: 3,
        }),
        this.prisma.toeicQuestionGroup.findMany({
          where: {
            imageUrl: asset.url,
          },
          select: {
            id: true,
          },
          take: 3,
        }),
        this.prisma.vocabulary.findMany({
          where: {
            audioUrl: asset.url,
          },
          select: {
            id: true,
          },
          take: 3,
        }),
      ]);

    const references: string[] = [];

    if (toeicAudioGroups.length > 0) {
      references.push('TOEIC group audio');
    }

    if (toeicImageGroups.length > 0) {
      references.push('TOEIC group image');
    }

    if (vocabularyItems.length > 0) {
      references.push('vocabulary audio');
    }

    if (references.length > 0) {
      throw new ConflictException(
        `Cannot delete file because it is used by ${references.join(', ')}`,
      );
    }
  }

  private async findAssetOrThrow(id: string): Promise<FileAsset> {
    const asset = await this.prisma.fileAsset.findUnique({
      where: { id },
    });

    if (!asset) {
      throw new NotFoundException('File asset not found');
    }

    return asset;
  }
}
