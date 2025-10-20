import { PrismaClient, LeaderboardPeriod, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export class LeaderboardService {
  // Get leaderboard by period
  static async getLeaderboard(
    period: LeaderboardPeriod = LeaderboardPeriod.ALL_TIME,
    limit: number = 50
  ) {
    const whereClause: Prisma.UserWhereInput = {};

    // Filter by time period
    const now = new Date();
    switch (period) {
      case LeaderboardPeriod.DAILY: {
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        whereClause.createdAt = { gte: startOfDay };
        break;
      }
      case LeaderboardPeriod.WEEKLY: {
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        whereClause.createdAt = { gte: startOfWeek };
        break;
      }
      case LeaderboardPeriod.MONTHLY: {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        whereClause.createdAt = { gte: startOfMonth };
        break;
      }
      case LeaderboardPeriod.ALL_TIME:
      default:
        // No filter for all time
        break;
    }

    // Get users with stats
    const users = await prisma.user.findMany({
      where: {
        isActive: true,
        ...whereClause
      },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        avatar: true,
        xp: true,
        level: true,
        rank: true,
        createdAt: true,
        _count: {
          select: {
            challengeProgress: {
              where: { status: 'COMPLETED' }
            },
            achievements: true
          }
        }
      },
      orderBy: { xp: 'desc' },
      take: limit
    });

    const leaderboard = users.map((user, index) => ({
      ...user,
      rank: index + 1,
      completedChallenges: user._count.challengeProgress,
      achievements: user._count.achievements
    }));

    return {
      period,
      leaderboard,
      total: users.length
    };
  }

  // Update user ranks
  static async updateRanks() {
    const users = await prisma.user.findMany({
      where: { isActive: true },
      select: { id: true, xp: true },
      orderBy: { xp: 'desc' }
    });

    await Promise.all(
      users.map((user, index) =>
        prisma.user.update({
          where: { id: user.id },
          data: { rank: index + 1 }
        })
      )
    );

    return { message: 'Ranks updated successfully' };
  }

  // Get user's position in leaderboard
  static async getUserRank(
    userId: string,
    period: LeaderboardPeriod = LeaderboardPeriod.ALL_TIME
  ) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { xp: true }
    });

    if (!user) {
      throw new Error('User not found');
    }

    const whereClause: Prisma.UserWhereInput = {};

    const now = new Date();
    switch (period) {
      case LeaderboardPeriod.DAILY: {
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        whereClause.createdAt = { gte: startOfDay };
        break;
      }
      case LeaderboardPeriod.WEEKLY: {
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        whereClause.createdAt = { gte: startOfWeek };
        break;
      }
      case LeaderboardPeriod.MONTHLY: {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        whereClause.createdAt = { gte: startOfMonth };
        break;
      }
    }

    const higherXpCount = await prisma.user.count({
      where: {
        isActive: true,
        xp: { gt: user.xp },
        ...whereClause
      }
    });

    return {
      userId,
      xp: user.xp,
      rank: higherXpCount + 1,
      period
    };
  }

  // Get leaderboard stats
  static async getLeaderboardStats() {
    const [totalUsers, totalChallenges, totalXP, topUser] = await Promise.all([
      prisma.user.count({ where: { isActive: true } }),
      prisma.challenge.count({ where: { isActive: true } }),
      prisma.user.aggregate({
        where: { isActive: true },
        _sum: { xp: true }
      }),
      prisma.user.findFirst({
        where: { isActive: true },
        orderBy: { xp: 'desc' },
        select: { username: true, xp: true, level: true }
      })
    ]);

    return {
      totalUsers,
      totalChallenges,
      totalXP: totalXP._sum.xp ?? 0,
      topUser,
      averageXP: totalUsers > 0 ? Math.round((totalXP._sum.xp ?? 0) / totalUsers) : 0
    };
  }
}
