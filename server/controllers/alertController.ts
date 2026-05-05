import { Request, Response, NextFunction } from 'express';
import { AlertService } from '../services/alertService';

export class AlertController {
  static async getAlerts(req: Request, res: Response, next: NextFunction) {
    try {
      const alerts = await AlertService.getAll();
      res.json(alerts);
    } catch (error) {
      next(error);
    }
  }

  static async markRead(req: Request, res: Response, next: NextFunction) {
    try {
      const alert = await AlertService.markAsRead(req.params.id);
      res.json(alert);
    } catch (error) {
      next(error);
    }
  }
}
