import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import type { ApiResponse } from '../common/interfaces/api-response.interface';
import { QueryFilesDto } from './dto/query-files.dto';
import { UploadFileDto } from './dto/upload-file.dto';
import { FilesService } from './files.service';

type UploadedFile = {
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
};

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 10 * 1024 * 1024,
      },
    }),
  )
  async uploadFile(
    @UploadedFile() file: UploadedFile | undefined,
    @Body() dto: UploadFileDto,
  ): Promise<ApiResponse<unknown>> {
    const asset = await this.filesService.uploadFile(file, dto.kind);

    return {
      success: true,
      message: 'File uploaded successfully',
      data: asset,
    };
  }

  @Get()
  async listFiles(
    @Query() query: QueryFilesDto,
  ): Promise<ApiResponse<unknown>> {
    const result = await this.filesService.listFiles(query);

    return {
      success: true,
      message: 'Files fetched successfully',
      data: result,
    };
  }

  @Get(':id')
  async getFile(@Param('id') id: string): Promise<ApiResponse<unknown>> {
    const asset = await this.filesService.getFile(id);

    return {
      success: true,
      message: 'File fetched successfully',
      data: asset,
    };
  }

  @Delete(':id')
  async deleteFile(@Param('id') id: string): Promise<ApiResponse<unknown>> {
    const asset = await this.filesService.deleteFile(id);

    return {
      success: true,
      message: 'File deleted successfully',
      data: asset,
    };
  }
}
