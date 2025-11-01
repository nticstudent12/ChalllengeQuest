import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export class UserService {
  // Get all users (admin only)
  static async getAllUsers(filters?: {
    search?: string;
    isActive?: boolean;
    isAdmin?: boolean;
    limit?: number;
    offset?: number;
  }) {
    const { search, isActive, isAdmin, limit = 50, offset = 0 } = filters || {};

    const where: Prisma.UserWhereInput = {};

    if (search) {
      where.OR = [
        { username: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (isAdmin !== undefined) {
      where.isAdmin = isAdmin;
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          username: true,
          firstName: true,
          lastName: true,
          avatar: true,
          xp: true,
          level: true,
          rank: true,
          isAdmin: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              challengeProgress: {
                where: { status: 'COMPLETED' }
              },
              achievements: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.user.count({ where }),
    ]);

    return {
      users,
      total,
      limit,
      offset,
    };
  }

  // Get user by ID
  static async getUserById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        avatar: true,
        xp: true,
        level: true,
        rank: true,
        isAdmin: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            challengeProgress: true,
            achievements: true,
          },
        },
        challengeProgress: {
          include: {
            challenge: {
              select: {
                id: true,
                title: true,
                xpReward: true,
              },
            },
          },
          orderBy: { startedAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  // Toggle user active status (admin only)
  static async toggleUserStatus(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { isActive: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { isActive: !user.isActive },
      select: {
        id: true,
        isActive: true,
      },
    });

    return updatedUser;
  }
}

