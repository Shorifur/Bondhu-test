import { Controller, Post, UseGuards, UploadedFile, UseInterceptors, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { PrismaService } from '../common/services/prisma.service';
import { R2Service } from './r2.service';

@ApiTags('Media')
@Controller('media')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MediaController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly r2: R2Service,
  ) {}

  @Post('upload')
  @ApiOperation({ summary: 'Upload media asset to R2' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @CurrentUser('id') userId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('folder') folder?: string,
  ) {
    const result = await this.r2.uploadFile(file, folder || 'media');

    const asset = await this.prisma.mediaAsset.create({
      data: {
        type: file.mimetype.startsWith('image/')
          ? 'IMAGE'
          : file.mimetype.startsWith('video/')
            ? 'VIDEO'
            : 'DOCUMENT',
        url: result.url,
        key: result.key,
        sizeBytes: result.sizeBytes,
        mimeType: result.mimeType,
        uploaderId: userId,
      },
    });

    return asset;
  }
}
