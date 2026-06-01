import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

export interface UploadResult {
  url: string;
  key: string;
  sizeBytes: number;
  mimeType: string;
}

@Injectable()
export class R2Service {
  private s3: S3Client;
  private bucket: string;
  private publicUrl: string;
  private enabled: boolean;

  constructor(private readonly config: ConfigService) {
    const accountId = this.config.get('R2_ACCOUNT_ID');
    const accessKeyId = this.config.get('R2_ACCESS_KEY_ID');
    const secretAccessKey = this.config.get('R2_SECRET_ACCESS_KEY');
    this.bucket = this.config.get('R2_BUCKET_NAME') || 'bondhu-media';
    this.publicUrl = this.config.get('R2_PUBLIC_URL') || '';
    this.enabled = !!(accountId && accessKeyId && secretAccessKey);

    if (this.enabled) {
      this.s3 = new S3Client({
        region: 'auto',
        endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
      });
    }
  }

  /**
   * Upload a file to Cloudflare R2
   * Falls back to placeholder URL if R2 is not configured
   */
  async uploadFile(file: Express.Multer.File, folder: string = 'media'): Promise<UploadResult> {
    if (!this.enabled) {
      // R2 not configured — return placeholder
      return {
        url: `https://placehold.co/600x400/5B21B6/FFFFFF?text=${encodeURIComponent(folder)}`,
        key: uuidv4(),
        sizeBytes: file.size,
        mimeType: file.mimetype,
      };
    }

    // Validate file
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new BadRequestException('File too large. Max 10MB.');
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException(`Invalid file type: ${file.mimetype}. Allowed: ${allowedTypes.join(', ')}`);
    }

    const key = `${folder}/${uuidv4()}-${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        Metadata: {
          originalName: file.originalname,
          uploadedAt: new Date().toISOString(),
        },
      }),
    );

    const url = this.publicUrl
      ? `${this.publicUrl}/${key}`
      : `https://${this.bucket}.${this.config.get('R2_ACCOUNT_ID')}.r2.cloudflarestorage.com/${key}`;

    return {
      url,
      key,
      sizeBytes: file.size,
      mimeType: file.mimetype,
    };
  }

  /**
   * Delete a file from R2
   */
  async deleteFile(key: string): Promise<void> {
    if (!this.enabled) return;

    await this.s3.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );
  }

  /**
   * Check if R2 is properly configured
   */
  isEnabled(): boolean {
    return this.enabled;
  }
}
