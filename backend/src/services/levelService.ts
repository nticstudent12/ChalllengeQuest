import { PrismaClient, Prisma } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schemas
export const createLevelSchema = z.object({
  number: z.number().min(1, 'Level number must be at least 1'),
  name: z.string().min(1, 'Level name is required').max(50, 'Level name too long'),
  minXP: z.number().min(0, 'Min XP must be non-negative'),
  maxXP: z.number().min(0, 'Max XP must be non-negative').optional(),
  isActive: z.boolean().optional().default(true),
});

export const updateLevelSchema = createLevelSchema.partial().extend({
  number: z.number().min(1).optional(),
});

export class LevelService {
  // Get all levels
  static async getLevels(includeInactive = false) {
    const where: Prisma.LevelWhereInput = {};
    
    if (!includeInactive) {
      where.isActive = true;
    }

    const levels = await prisma.level.findMany({
      where,
      orderBy: { number: 'asc' },
    });

    return levels;
  }

  // Get level by number
  static async getLevelByNumber(number: number) {
    const level = await prisma.level.findUnique({
      where: { number },
    });

    return level;
  }

  // Get level by ID
  static async getLevelById(id: string) {
    const level = await prisma.level.findUnique({
      where: { id },
    });

    if (!level) {
      throw new Error('Level not found');
    }

    return level;
  }

  // Create level (admin only)
  static async createLevel(data: z.infer<typeof createLevelSchema>) {
    const validatedData = createLevelSchema.parse(data);

    // Check if level number already exists
    const existingLevel = await prisma.level.findUnique({
      where: { number: validatedData.number },
    });

    if (existingLevel) {
      throw new Error(`Level ${validatedData.number} already exists`);
    }

    // Validate XP ranges don't overlap with existing levels
    const overlappingLevel = await prisma.level.findFirst({
      where: {
        number: { not: validatedData.number },
        OR: [
          {
            AND: [
              { minXP: { lte: validatedData.minXP } },
              {
                OR: [
                  { maxXP: { gte: validatedData.minXP } },
                  { maxXP: null },
                ],
              },
            ],
          },
          {
            AND: [
              { minXP: { lte: validatedData.maxXP ?? Infinity } },
              {
                OR: [
                  { maxXP: { gte: validatedData.maxXP ?? Infinity } },
                  { maxXP: null },
                ],
              },
            ],
          },
        ],
      },
    });

    if (overlappingLevel) {
      throw new Error(`XP range overlaps with existing level ${overlappingLevel.number}`);
    }

    // Validate maxXP is greater than minXP if both are provided
    if (validatedData.maxXP !== undefined && validatedData.maxXP <= validatedData.minXP) {
      throw new Error('Max XP must be greater than Min XP');
    }

    const level = await prisma.level.create({
      data: {
        number: validatedData.number,
        name: validatedData.name,
        minXP: validatedData.minXP,
        maxXP: validatedData.maxXP,
        isActive: validatedData.isActive ?? true,
      },
    });

    return level;
  }

  // Update level (admin only)
  static async updateLevel(id: string, data: z.infer<typeof updateLevelSchema>) {
    const validatedData = updateLevelSchema.parse(data);

    const existingLevel = await prisma.level.findUnique({
      where: { id },
    });

    if (!existingLevel) {
      throw new Error('Level not found');
    }

    // If updating level number, check for conflicts
    if (validatedData.number && validatedData.number !== existingLevel.number) {
      const conflictingLevel = await prisma.level.findUnique({
        where: { number: validatedData.number },
      });

      if (conflictingLevel) {
        throw new Error(`Level ${validatedData.number} already exists`);
      }
    }

    // If updating XP ranges, validate they don't overlap
    const minXP = validatedData.minXP ?? existingLevel.minXP;
    const maxXP = validatedData.maxXP ?? existingLevel.maxXP;

    if (maxXP !== null && maxXP !== undefined && maxXP <= minXP) {
      throw new Error('Max XP must be greater than Min XP');
    }

    const level = await prisma.level.update({
      where: { id },
      data: validatedData,
    });

    return level;
  }

  // Delete level (admin only)
  static async deleteLevel(id: string) {
    // Get the level first
    const level = await prisma.level.findUnique({ where: { id } });
    
    if (!level) {
      throw new Error('Level not found');
    }

    // Check if level is used by any challenges
    const challengesUsingLevel = await prisma.challenge.count({
      where: { requiredLevel: level.number },
    });

    if (challengesUsingLevel > 0) {
      throw new Error('Cannot delete level that is used by challenges');
    }

    await prisma.level.delete({
      where: { id },
    });

    return { message: 'Level deleted successfully' };
  }

  // Get level for user based on XP
  static async getLevelForXP(xp: number) {
    const level = await prisma.level.findFirst({
      where: {
        isActive: true,
        minXP: { lte: xp },
        OR: [
          { maxXP: { gte: xp } },
          { maxXP: null },
        ],
      },
      orderBy: { number: 'desc' },
    });

    return level;
  }

  // Calculate user level from XP using level system
  static async calculateUserLevel(xp: number): Promise<number> {
    const level = await this.getLevelForXP(xp);
    return level ? level.number : 1;
  }

  // Update user levels for all users (can be called periodically)
  static async updateAllUserLevels() {
    const users = await prisma.user.findMany({
      select: { id: true, xp: true },
    });

    let updated = 0;
    for (const user of users) {
      const calculatedLevel = await this.calculateUserLevel(user.xp);
      await prisma.user.update({
        where: { id: user.id },
        data: { level: calculatedLevel },
      });
      updated++;
    }

    return { message: `Updated levels for ${updated} users` };
  }
}

