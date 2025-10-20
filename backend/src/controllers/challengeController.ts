import { Request, Response } from 'express';
import { ProgressStatus } from '@prisma/client';
import { ChallengeService, createChallengeSchema, joinChallengeSchema, submitStageSchema } from '../services/challengeService';
import { AuthRequest } from '../middleware/auth';

export class ChallengeController {
  // Create challenge (admin only)
  static async createChallenge(req: AuthRequest, res: Response): Promise<void> {
    try {
      const challenge = await ChallengeService.createChallenge(req.body);
      
      res.status(201).json({
        success: true,
        message: 'Challenge created successfully',
        data: challenge
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      res.status(400).json({
        success: false,
        error: message
      });
    }
  }

  // Get all challenges
  static async getChallenges(req: Request, res: Response): Promise<void> {
    try {
      const filters = {
        category: req.query.category as string,
        difficulty: req.query.difficulty as string,
        status: req.query.status as 'active' | 'upcoming' | 'completed' | 'all',
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        offset: req.query.offset ? parseInt(req.query.offset as string) : undefined
      };

      const result = await ChallengeService.getChallenges(filters);
      
      res.json({
        success: true,
        data: result
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      res.status(400).json({
        success: false,
        error: message
      });
    }
  }

  // Get challenge by ID
  static async getChallengeById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as AuthRequest).user?.id;
      
      const challenge = await ChallengeService.getChallengeById(id, userId);
      
      res.json({
        success: true,
        data: challenge
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      res.status(404).json({
        success: false,
        error: message
      });
    }
  }

  // Join challenge
  static async joinChallenge(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { challengeId } = req.body;
      const userId = req.user!.id;
      
      const progress = await ChallengeService.joinChallenge(userId, challengeId);
      
      res.json({
        success: true,
        message: 'Successfully joined challenge',
        data: progress
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      res.status(400).json({
        success: false,
        error: message
      });
    }
  }

  // Submit stage completion
  static async submitStage(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      
      const stageProgress = await ChallengeService.submitStage(userId, req.body);
      
      res.json({
        success: true,
        message: 'Stage completed successfully',
        data: stageProgress
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      res.status(400).json({
        success: false,
        error: message
      });
    }
  }

  // Get user's challenges
  // ✅ Get user's challenges (with debug logs)
static async getUserChallenges(req: AuthRequest, res: Response): Promise<void> {
  try {
    console.log("📥 [getUserChallenges] Incoming request...");

    // 🔍 Log the entire user payload
    console.log("🔐 Authenticated user payload:", req.user);

    const userId = req.user?.id;
    if (!userId) {
      console.warn("❌ No userId found in request!");
      res.status(401).json({ success: false, error: "Unauthorized" });
      return;
    }

    // 🧠 Extract and validate status filter
    const statusParam = (req.query.status as string | undefined)?.toUpperCase();
    const isValidStatus =
      statusParam && (Object.values(ProgressStatus) as string[]).includes(statusParam);
    const status = isValidStatus ? (statusParam as ProgressStatus) : undefined;

    console.log("👤 userId:", userId);
    console.log("📊 status filter:", status || "none");

    // 🧱 Call ChallengeService
    console.log("⚙️ Calling ChallengeService.getUserChallenges...");
    const challenges = await ChallengeService.getUserChallenges(userId, status);

    // 🧾 Log results
    console.log(`✅ Found ${challenges.length} challenge progress record(s)`);
    if (challenges.length > 0) {
      console.log("🧩 First challenge result:", JSON.stringify(challenges[0], null, 2));
    } else {
      console.log("⚠️ No challenges found for this user or filter");
    }

    // 📤 Respond
    res.json({
      success: true,
      data: challenges,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("💥 Error in getUserChallenges:", message);
    res.status(400).json({
      success: false,
      error: message,
    });
  }
}

  // Update challenge (admin only)
 // Update challenge (admin only)
static async updateChallenge(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedChallenge = await ChallengeService.updateChallenge(id, updatedData);

    res.json({
      success: true,
      message: 'Challenge updated successfully',
      data: updatedChallenge
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({
      success: false,
      error: message
    });
  }
}

 // Delete challenge (admin only)
static async deleteChallenge(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const result = await ChallengeService.deleteChallenge(id);

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
