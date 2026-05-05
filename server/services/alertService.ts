import { prisma } from '../lib/prisma';

export class AlertService {
  static async getAll() {
    return await prisma.alert.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20
    });
  }

  static async markAsRead(id: string) {
    return await prisma.alert.update({
      where: { id },
      data: { read: true }
    });
  }

  static async createAlert(data: { type: string, message: string, privacyRequestId?: string }) {
    return await prisma.alert.create({
      data
    });
  }
}
