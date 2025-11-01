import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { AuthRequest } from '../middleware/auth';

export class UserController {
  // Get all users (admin only)
  static async getAllUsers(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { search, isActive, isAdmin, limit, offset } = req.query;

      const filters: any = {};
      if (search) filters.search = search as string;
      if (isActive !== undefined) filters.isActive = isActive === 'true';
      if (isAdmin !== undefined) filters.isAdmin = isAdmin === 'true';
      if (limit) filters.limit = parseInt(limit as string);
      if (offset) filters.offset = parseInt(offset as string);

      const result = await UserService.getAllUsers(filters);

      res.json({
        success: true,
        data: result,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      res.status(400).json({
        success: false,
        error: message,
      });
    }
  }

  // Get user by ID (admin only)
  static async getUserById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await UserService.getUserById(id);

      res.json({
        success: true,
        data: user,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      res.status(404).json({
        success: false,
        error: message,
      });
    }
  }

  // Toggle user active status (admin only)
  static async toggleUserStatus(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await UserService.toggleUserStatus(id);

      res.json({
        success: true,
        message: `User ${result.isActive ? 'activated' : 'deactivated'} successfully`,
        data: result,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      res.status(400).json({
        success: false,
        error: message,
      });
    }
  }
}

