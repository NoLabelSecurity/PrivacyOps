import { Request, Response, NextFunction } from 'express';
import { MetricsService } from '../services/metricsService';

export class MetricsController {
  static async getMetrics(req: Request, res: Response, next: NextFunction) {
    try {
      const metrics = await MetricsService.getDashboardMetrics();
      res.json(metrics);
    } catch (error) {
      next(error);
    }
  }
}
