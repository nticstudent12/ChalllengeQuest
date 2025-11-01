import { Request, Response } from 'express';
import { LevelService, createLevelSchema, updateLevelSchema } from '../services/levelService';
import { AuthRequest } from '../middleware/auth';

export class LevelController {
  // Get all levels
  static async getLevels(req: Request, res: Response): Promise<void> {
    try {
      const includeInactive = req.query.includeInactive === 'true';
      const levels = await LevelService.getLevels(includeInactive);

      res.json({
        success: true,
        data: levels,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      res.status(400).json({
        success: false,
        error: message,
      });
    }
  }

  // Get level by ID
  static async getLevelById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const level = await LevelService.getLevelById(id);

      res.json({
        success: true,
        data: level,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      res.status(404).json({
        success: false,
        error: message,
      });
    }
  }

  // Create level (admin only)
  static async createLevel(req: AuthRequest, res: Response): Promise<void> {
    try {
      const level = await LevelService.createLevel(req.body);

      res.status(201).json({
        success: true,
        message: 'Level created successfully',
        data: level,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      res.status(400).json({
        success: false,
        error: message,
      });
    }
  }

  // Update level (admin only)
  static async updateLevel(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const level = await LevelService.updateLevel(id, req.body);

      res.json({
        success: true,
        message: 'Level updated successfully',
        data: level,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      res.status(400).json({
        success: false,
        error: message,
      });
    }
  }

  // Delete level (admin only)
  static async deleteLevel(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await LevelService.deleteLevel(id);

      res.json({
        success: true,
        message: result.message,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      res.status(400).json({
        success: false,
        error: message,
      });
    }
  }

  // Update all user levels (admin only)
  static async updateAllUserLevels(req: AuthRequest, res: Response): Promise<void> {
    try {
      const result = await LevelService.updateAllUserLevels();

      res.json({
        success: true,
        message: result.message,
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

