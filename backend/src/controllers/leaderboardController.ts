import { Request, Response } from 'express';
import { LeaderboardService } from '../services/leaderboardService';
import { AuthRequest } from '../middleware/auth';
import { LeaderboardPeriod } from '@prisma/client'; // ✅ Import enum directly

export class LeaderboardController {
  // ✅ Get leaderboard
  static async getLeaderboard(req: Request, res: Response): Promise<void> {
    try {
      const periodParam = (req.query.period as string)?.toUpperCase();
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;

      // ✅ Validate period
      const period = Object.values(LeaderboardPeriod).includes(periodParam as LeaderboardPeriod)
        ? (periodParam as LeaderboardPeriod)
        : LeaderboardPeriod.ALL_TIME;

      const leaderboard = await LeaderboardService.getLeaderboard(period, limit);

      res.json({
        success: true,
        data: leaderboard,
      });
    } catch (error) {
      const err = error instanceof Error ? error.message : 'Unknown error';
      res.status(400).json({
        success: false,
        error: err,
      });
    }
  }

  // ✅ Get user's rank
  static async getUserRank(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized: missing user ID',
        });
        return;
      }

      const periodParam = (req.query.period as string)?.toUpperCase();
      const period = Object.values(LeaderboardPeriod).includes(periodParam as LeaderboardPeriod)
        ? (periodParam as LeaderboardPeriod)
        : LeaderboardPeriod.ALL_TIME;

      const rank = await LeaderboardService.getUserRank(userId, period);

      res.json({
        success: true,
        data: rank,
      });
    } catch (error) {
      const err = error instanceof Error ? error.message : 'Unknown error';
      res.status(400).json({
        success: false,
        error: err,
      });
    }
  }

  // ✅ Get leaderboard stats
  static async getStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await LeaderboardService.getLeaderboardStats();
      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      const err = error instanceof Error ? error.message : 'Unknown error';
      res.status(400).json({
        success: false,
        error: err,
      });
    }
  }

  // ✅ Update ranks (admin only)
  static async updateRanks(req: AuthRequest, res: Response): Promise<void> {
    try {
      const result = await LeaderboardService.updateRanks();
      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      const err = error instanceof Error ? error.message : 'Unknown error';
      res.status(400).json({
        success: false,
        error: err,
      });
    }
  }
}
