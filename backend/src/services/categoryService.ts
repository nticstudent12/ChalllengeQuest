import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schemas
export const createCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(50, 'Category name too long'),
  description: z.string().max(200, 'Description too long').optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
});

export const updateCategorySchema = createCategorySchema.partial();

// Category service class
export class CategoryService {
  // Create new category (admin only)
  static async createCategory(data: z.infer<typeof createCategorySchema>) {
    const validatedData = createCategorySchema.parse(data);

    // Check if category already exists (case-insensitive)
    const existingCategory = await prisma.category.findFirst({
      where: {
        name: {
          equals: validatedData.name,
          mode: 'insensitive',
        },
      },
    });

    if (existingCategory) {
      throw new Error('Category with this name already exists');
    }

    const category = await prisma.category.create({
      data: {
        name: validatedData.name.trim(),
        description: validatedData.description?.trim(),
        icon: validatedData.icon?.trim(),
        color: validatedData.color?.trim(),
      },
    });

    return category;
  }

  // Get all categories
  static async getCategories(includeInactive = false) {
    const categories = await prisma.category.findMany({
      where: includeInactive ? {} : { isActive: true },
      orderBy: {
        name: 'asc',
      },
    });

    return categories;
  }

  // Get category by ID
  static async getCategoryById(id: string) {
    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new Error('Category not found');
    }

    return category;
  }

  // Update category (admin only)
  static async updateCategory(id: string, data: z.infer<typeof updateCategorySchema>) {
    const validatedData = updateCategorySchema.parse(data);

    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      throw new Error('Category not found');
    }

    // Check if new name conflicts with existing category (case-insensitive)
    if (validatedData.name) {
      const conflictingCategory = await prisma.category.findFirst({
        where: {
          id: { not: id },
          name: {
            equals: validatedData.name,
            mode: 'insensitive',
          },
        },
      });

      if (conflictingCategory) {
        throw new Error('Category with this name already exists');
      }
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        ...validatedData,
        ...(validatedData.name && { name: validatedData.name.trim() }),
        ...(validatedData.description !== undefined && {
          description: validatedData.description?.trim() || null,
        }),
        ...(validatedData.icon !== undefined && { icon: validatedData.icon?.trim() || null }),
        ...(validatedData.color !== undefined && { color: validatedData.color?.trim() || null }),
      },
    });

    return category;
  }

  // Delete category (admin only)
  static async deleteCategory(id: string) {
    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new Error('Category not found');
    }

    // Check if category is used in any challenges
    const challengeCount = await prisma.challenge.count({
      where: {
        category: category.name,
      },
    });

    if (challengeCount > 0) {
      // Soft delete - set isActive to false instead of deleting
      return await prisma.category.update({
        where: { id },
        data: { isActive: false },
      });
    }

    // Hard delete if no challenges use it
    await prisma.category.delete({
      where: { id },
    });

    return { message: 'Category deleted successfully' };
  }

  // Toggle category active status
  static async toggleCategoryStatus(id: string) {
    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new Error('Category not found');
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        isActive: !category.isActive,
      },
    });

    return updatedCategory;
  }
}
