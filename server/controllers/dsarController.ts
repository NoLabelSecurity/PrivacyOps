import { Request, Response, NextFunction } from 'express';
import { RequestService } from '../services/dsarService';

export class RequestController {
  static async getRequests(req: Request, res: Response, next: NextFunction) {
    try {
      const requests = await RequestService.getAll();
      res.json(requests);
    } catch (error) {
      next(error);
    }
  }

  static async getRequestById(req: Request, res: Response, next: NextFunction) {
    try {
      const request = await RequestService.getById(req.params.id);
      if (!request) return res.status(404).json({ message: 'Request not found' });
      res.json(request);
    } catch (error) {
      next(error);
    }
  }

  static async createRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const { userEmail, requestType, notes } = req.body;
      if (!userEmail || !requestType) {
        return res.status(400).json({ message: 'Email and type are required' });
      }
      const request = await RequestService.create({
        userEmail,
        requestType,
        notes
      });
      res.status(201).json(request);
    } catch (error) {
      next(error);
    }
  }

  static async updateRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const { status } = req.body;
      const request = await RequestService.updateStatus(req.params.id, status);
      res.json(request);
    } catch (error) {
      next(error);
    }
  }
}
