import { Controller, Post, UseGuards, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { PrismaService } from '../common/services/prisma.service';
import { v4 as uuidv4 } from 'uuid';

@ApiTags('Media')
@Controller('media')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MediaController {
  constructor(private readonly prisma: PrismaService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Upload media asset' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@CurrentUser('id') userId: string, @UploadedFile() file: Express.Multer.File) {
    // In production: upload to MinIO/S3, generate thumbnails, HLS for video
    // Mock: create MediaAsset record with a placeholder URL
    const asset = await this.prisma.mediaAsset.create({
      data: {
        type: file.mimetype.startsWith('image/') ? 'IMAGE' : file.mimetype.startsWith('video/') ? 'VIDEO' : 'DOCUMENT',
        url: `https://cdn.bondhu.app/media/${uuidv4()}-${file.originalname}`,
        key: uuidv4(),
        sizeBytes: file.size,
        mimeType: file.mimetype,
      },
    });
    return asset;
  }
}
