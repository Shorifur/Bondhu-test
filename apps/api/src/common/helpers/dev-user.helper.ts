import { Logger } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';

const logger = new Logger('DevUserHelper');

export const DEV_USER_ID = '00000000-0000-4000-a000-000000000001';
export const DEV_USER_PHONE = '+8801712345678';
export const DEV_HANDLE = 'dev_tester';
export const DEV_TOKEN = 'dev-mock-access-token';

export async function getOrCreateDevUser(prisma: PrismaService) {
  try {
    const existing = await prisma.user.findUnique({
      where: { id: DEV_USER_ID },
      include: { profile: true },
    });

    if (existing) {
      return existing;
    }

    // If another record already owns our dev phone number, remove it first
    // so we can recreate with the exact dev UUID and relations.
    const phoneConflict = await prisma.user.findUnique({
      where: { phoneNumber: DEV_USER_PHONE },
    });

    if (phoneConflict) {
      await prisma.user.delete({ where: { id: phoneConflict.id } });
    }

    await prisma.user.create({
      data: {
        id: DEV_USER_ID,
        phoneNumber: DEV_USER_PHONE,
        phoneVerified: true,
        isActive: true,
      },
    });

    await prisma.userProfile.create({
      data: {
        userId: DEV_USER_ID,
        legalName: 'Dev Tester',
        displayName: 'Dev Tester',
        handle: DEV_HANDLE,
      },
    });

    await prisma.userSettings.create({
      data: {
        userId: DEV_USER_ID,
      },
    });

    await prisma.userPreference.create({
      data: {
        userId: DEV_USER_ID,
      },
    });

    const user = await prisma.user.findUnique({
      where: { id: DEV_USER_ID, isActive: true },
      include: { profile: true },
    });

    if (!user) {
      throw new Error('Dev user was not found after creation');
    }

    return user;
  } catch (error) {
    logger.error('Failed to get or create dev user', error instanceof Error ? error.stack : String(error));
    throw error;
  }
}
