import { Request, Response } from 'express';
import { CategoryService } from '../services/categoryService';
import { AuthRequest } from '../middleware/auth';

export class CategoryController {
  // Create category (admin only)
  static async createCategory(req: AuthRequest, res: Response): Promise<void> {
    try {
      const category = await CategoryService.createCategory(req.body);

      res.status(201).json({
        success: true,
        message: 'Category created successfully',
        data: category,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      res.status(400).json({
        success: false,
        error: message,
      });
    }
  }

  // Get all categories
  static async getCategories(req: Request, res: Response): Promise<void> {
    try {
      const includeInactive = req.query.includeInactive === 'true';
      const categories = await CategoryService.getCategories(includeInactive);

      res.json({
        success: true,
        data: categories,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      res.status(400).json({
        success: false,
        error: message,
      });
    }
  }

  // Get category by ID
  static async getCategoryById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const category = await CategoryService.getCategoryById(id);

      res.json({
        success: true,
        data: category,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      res.status(404).json({
        success: false,
        error: message,
      });
    }
  }

  // Update category (admin only)
  static async updateCategory(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const category = await CategoryService.updateCategory(id, req.body);

      res.json({
        success: true,
        message: 'Category updated successfully',
        data: category,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      res.status(400).json({
        success: false,
        error: message,
      });
    }
  }

  // Delete category (admin only)
  static async deleteCategory(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await CategoryService.deleteCategory(id);

      res.json({
        success: true,
        message: 'Category deleted successfully',
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

  // Toggle category status (admin only)
  static async toggleCategoryStatus(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const category = await CategoryService.toggleCategoryStatus(id);

      res.json({
        success: true,
        message: `Category ${category.isActive ? 'activated' : 'deactivated'} successfully`,
        data: category,
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
