import { PrismaClient, Difficulty, ProgressStatus, Prisma } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schemas
export const createChallengeSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  description: z.string().min(1, 'Description is required').max(1000, 'Description too long'),
  category: z.string().min(1, 'Category is required'),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']),
  xpReward: z.number().min(1, 'XP reward must be positive'),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  maxParticipants: z.number().optional(),
  stages: z.array(z.object({
    title: z.string().min(1, 'Stage title is required'),
    description: z.string().min(1, 'Stage description is required'),
    order: z.number().min(1, 'Stage order must be positive'),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    radius: z.number().min(1).max(1000).default(50),
    qrCode: z.string().optional()
  })).min(1, 'At least one stage is required')
});

export const updateChallengeSchema = createChallengeSchema
  .partial()
  .extend({
    isActive: z.boolean().optional()
  });

export const joinChallengeSchema = z.object({
  challengeId: z.string().min(1, 'Challenge ID is required')
});

export const submitStageSchema = z.object({
  stageId: z.string().min(1, 'Stage ID is required'),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  submissionType: z.enum(['TEXT', 'IMAGE', 'LOCATION', 'QR_CODE']),
  content: z.string().optional()
});

// Challenge service class
export class ChallengeService {
  // Create new challenge (admin only)
  static async createChallenge(data: z.infer<typeof createChallengeSchema>) {
    const validatedData = createChallengeSchema.parse(data);

    // Validate dates
    const startDate = new Date(validatedData.startDate);
    const endDate = new Date(validatedData.endDate);
    
    if (startDate >= endDate) {
      throw new Error('End date must be after start date');
    }

    if (startDate < new Date()) {
      throw new Error('Start date cannot be in the past');
    }

    // Create challenge with stages
    const challenge = await prisma.challenge.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        category: validatedData.category,
        difficulty: validatedData.difficulty as Difficulty,
        xpReward: validatedData.xpReward,
        startDate,
        endDate,
        maxParticipants: validatedData.maxParticipants,
        stages: {
          create: validatedData.stages.map(stage => ({
            title: stage.title,
            description: stage.description,
            order: stage.order,
            latitude: stage.latitude,
            longitude: stage.longitude,
            radius: stage.radius,
            qrCode: stage.qrCode
          }))
        }
      },
      include: {
        stages: {
          orderBy: { order: 'asc' }
        },
        _count: {
          select: {
            progress: true
          }
        }
      }
    });

    return challenge;
  }

  // Get all challenges with filters
  static async getChallenges(filters: {
    category?: string;
    difficulty?: string;
    status?: 'active' | 'upcoming' | 'completed' | 'all';
    limit?: number;
    offset?: number;
  }) {
    const { category, difficulty, status, limit = 20, offset = 0 } = filters;

    const where: Prisma.ChallengeWhereInput = {};

    if (category && category !== 'all') {
      where.category = category;
    }

    if (difficulty && difficulty !== 'all') {
      const normalized = difficulty.toUpperCase() as Difficulty;
      if ((Object.values(Difficulty) as string[]).includes(normalized)) {
        where.difficulty = normalized;
      }
    }

    if (status && status !== 'all') {
      const now = new Date();
      switch (status) {
        case 'active':
          where.startDate = { lte: now };
          where.endDate = { gte: now };
          where.isActive = true;
          break;
        case 'upcoming':
          where.startDate = { gt: now };
          where.isActive = true;
          break;
        case 'completed':
          where.endDate = { lt: now };
          break;
      }
    }

    const [challenges, total] = await Promise.all([
      prisma.challenge.findMany({
        where,
        include: {
          stages: {
            orderBy: { order: 'asc' },
            select: {
              id: true,
              title: true,
              order: true,
              latitude: true,
              longitude: true,
              radius: true
            }
          },
          _count: {
            select: {
              progress: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset
      }),
      prisma.challenge.count({ where })
    ]);

    return {
      challenges,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    };
  }

  // Get challenge by ID
  static async getChallengeById(challengeId: string, userId?: string) {
    const challenge = await prisma.challenge.findUnique({
      where: { id: challengeId },
      include: {
        stages: {
          orderBy: { order: 'asc' }
        },
        _count: {
          select: {
            progress: true
          }
        }
      }
    });

    if (!challenge) {
      throw new Error('Challenge not found');
    }

    // If user is provided, include their progress
    let userProgress = null;
    if (userId) {
      userProgress = await prisma.challengeProgress.findUnique({
        where: {
          userId_challengeId: {
            userId,
            challengeId
          }
        },
        include: {
          stages: {
            include: {
              stage: true
            },
            orderBy: {
              stage: { order: 'asc' }
            }
          }
        }
      });
    }

    return {
      ...challenge,
      userProgress
    };
  }

// Update challenge (admin only)
static async updateChallenge(id: string, data: z.infer<typeof updateChallengeSchema>) {
  // Validate and parse incoming data
  const validatedData = updateChallengeSchema.parse(data);

  // Find existing challenge
  const existingChallenge = await prisma.challenge.findUnique({
    where: { id },
    include: { stages: true },
  });

  if (!existingChallenge) {
    throw new Error('Challenge not found');
  }

  // If dates are provided, validate them
  if (validatedData.startDate && validatedData.endDate) {
    const startDate = new Date(validatedData.startDate);
    const endDate = new Date(validatedData.endDate);

    if (startDate >= endDate) {
      throw new Error('End date must be after start date');
    }
  }

  // Build update data
  const updateData: Prisma.ChallengeUpdateInput = {
    title: validatedData.title ?? existingChallenge.title,
    description: validatedData.description ?? existingChallenge.description,
    category: validatedData.category ?? existingChallenge.category,
    difficulty: validatedData.difficulty ?? existingChallenge.difficulty,
    xpReward: validatedData.xpReward ?? existingChallenge.xpReward,
    startDate: validatedData.startDate ? new Date(validatedData.startDate) : existingChallenge.startDate,
    endDate: validatedData.endDate ? new Date(validatedData.endDate) : existingChallenge.endDate,
    maxParticipants: validatedData.maxParticipants ?? existingChallenge.maxParticipants,
    isActive: typeof validatedData.isActive === 'boolean' ? validatedData.isActive : existingChallenge.isActive,
  };

  // If stages are provided, replace them
  if (validatedData.stages && validatedData.stages.length > 0) {
    // Delete old stages
    await prisma.stage.deleteMany({
      where: { challengeId: id },
    });

    // Recreate stages
    updateData.stages = {
      create: validatedData.stages.map(stage => ({
        title: stage.title,
        description: stage.description,
        order: stage.order,
        latitude: stage.latitude,
        longitude: stage.longitude,
        radius: stage.radius,
        qrCode: stage.qrCode,
      })),
    };
  }

  // Perform update
  const updatedChallenge = await prisma.challenge.update({
    where: { id },
    data: updateData,
    include: {
      stages: {
        orderBy: { order: 'asc' },
      },
      _count: {
        select: {
          progress: true,
        },
      },
    },
  });

  return updatedChallenge;
}


// Delete challenge (admin only)
static async deleteChallenge(id: string) {
  // Check if challenge exists
  const challenge = await prisma.challenge.findUnique({
    where: { id },
    include: { stages: true, progress: true },
  });

  if (!challenge) {
    throw new Error('Challenge not found');
  }

  // Delete related data in correct order (to avoid foreign key constraint errors)
  await prisma.stageProgress.deleteMany({
    where: {
      stage: { challengeId: id },
    },
  });

  await prisma.challengeProgress.deleteMany({
    where: { challengeId: id },
  });

  await prisma.stage.deleteMany({
    where: { challengeId: id },
  });

  // Finally delete the challenge itself
  await prisma.challenge.delete({
    where: { id },
  });

  return { message: 'Challenge deleted successfully' };
}

  static async joinChallenge(userId: string, challengeId: string) {
    // Check if challenge exists and is active
    const challenge = await prisma.challenge.findUnique({
      where: { id: challengeId }
    });

    if (!challenge) {
      throw new Error('Challenge not found');
    }

    if (!challenge.isActive) {
      throw new Error('Challenge is not active');
    }

    const now = new Date();
    if (now < challenge.startDate) {
      throw new Error('Challenge has not started yet');
    }

    if (now > challenge.endDate) {
      throw new Error('Challenge has ended');
    }

    // Check if user already joined
    const existingProgress = await prisma.challengeProgress.findUnique({
      where: {
        userId_challengeId: {
          userId,
          challengeId
        }
      }
    });

    if (existingProgress) {
      throw new Error('You have already joined this challenge');
    }

    // Check participant limit
    if (challenge.maxParticipants) {
      const participantCount = await prisma.challengeProgress.count({
        where: { challengeId }
      });

      if (participantCount >= challenge.maxParticipants) {
        throw new Error('Challenge is full');
      }
    }

    // Create challenge progress
    const progress = await prisma.challengeProgress.create({
      data: {
        userId,
        challengeId,
        status: 'ACTIVE'
      },
      include: {
        challenge: {
          include: {
            stages: {
              orderBy: { order: 'asc' }
            }
          }
        }
      }
    });

    return progress;
  }

  // Submit stage completion
  static async submitStage(userId: string, data: z.infer<typeof submitStageSchema>) {
    const validatedData = submitStageSchema.parse(data);

    // Get challenge progress
    const stage = await prisma.stage.findUnique({
      where: { id: validatedData.stageId },
      include: {
        challenge: true
      }
    });

    if (!stage) {
      throw new Error('Stage not found');
    }

    const progress = await prisma.challengeProgress.findUnique({
      where: {
        userId_challengeId: {
          userId,
          challengeId: stage.challengeId
        }
      }
    });

    if (!progress) {
      throw new Error('You have not joined this challenge');
    }

    if (progress.status !== 'ACTIVE') {
      throw new Error('Challenge is not active');
    }

    // Check if stage is already completed
    const existingStageProgress = await prisma.stageProgress.findUnique({
      where: {
        challengeProgressId_stageId: {
          challengeProgressId: progress.id,
          stageId: validatedData.stageId
        }
      }
    });

    if (existingStageProgress && existingStageProgress.status === 'COMPLETED') {
      throw new Error('Stage already completed');
    }

    // Validate location (simplified - you can add more sophisticated GPS validation)
    const distance = this.calculateDistance(
      validatedData.latitude,
      validatedData.longitude,
      stage.latitude,
      stage.longitude
    );

    if (distance > stage.radius) {
      throw new Error(`You must be within ${stage.radius}m of the stage location`);
    }

    // Create or update stage progress
    const stageProgress = await prisma.stageProgress.upsert({
      where: {
        challengeProgressId_stageId: {
          challengeProgressId: progress.id,
          stageId: validatedData.stageId
        }
      },
      update: {
        status: 'COMPLETED',
        completedAt: new Date(),
        latitude: validatedData.latitude,
        longitude: validatedData.longitude
      },
      create: {
        challengeProgressId: progress.id,
        stageId: validatedData.stageId,
        status: 'COMPLETED',
        completedAt: new Date(),
        latitude: validatedData.latitude,
        longitude: validatedData.longitude
      }
    });

    // Check if all stages are completed
    const completedStages = await prisma.stageProgress.count({
      where: {
        challengeProgressId: progress.id,
        status: 'COMPLETED'
      }
    });

    const totalStages = await prisma.stage.count({
      where: { challengeId: stage.challengeId }
    });

    if (completedStages === totalStages) {
      // Complete the challenge
      await prisma.challengeProgress.update({
        where: { id: progress.id },
        data: {
          status: 'COMPLETED',
          completedAt: new Date()
        }
      });

      // Award XP
      await prisma.user.update({
        where: { id: userId },
        data: {
          xp: {
            increment: stage.challenge.xpReward
          }
        }
      });

      // Update user level (simplified level calculation)
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { xp: true }
      });

      if (user) {
        const newLevel = Math.floor(user.xp / 1000) + 1;
        await prisma.user.update({
          where: { id: userId },
          data: { level: newLevel }
        });
      }
    }

    return stageProgress;
  }

  // Get user's challenges
  static async getUserChallenges(userId: string, status?: ProgressStatus) {
    const where: Prisma.ChallengeProgressWhereInput = { userId };
    if (status) {
      where.status = status;
    }

    const challenges = await prisma.challengeProgress.findMany({
      where,
      include: {
        challenge: {
          include: {
            stages: {
              orderBy: { order: 'asc' }
            },
            _count: {
              select: {
                progress: true
              }
            }
          }
        },
        stages: {
          include: {
            stage: true
          },
          orderBy: {
            stage: { order: 'asc' }
          }
        }
      },
      orderBy: { startedAt: 'desc' }
    });

    return challenges;
  }

  // Helper function to calculate distance between two points
  private static calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distance in meters
  }
}
