import { prisma } from '../lib/prisma';

export class AuditLogService {
  static async log(action: string, entity: string, entityId?: string, details?: string) {
    return await prisma.auditLog.create({
      data: { action, entity, entityId, details }
    });
  }

  static async getAll() {
    return await prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100
    });
  }
}
