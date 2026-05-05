import { prisma } from '../lib/prisma';
import { AuditLogService } from './auditLogService';

export class RequestService {
  static async getAll() {
    return await prisma.privacyRequest.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  static async getById(id: string) {
    return await prisma.privacyRequest.findUnique({
      where: { id }
    });
  }

  static async create(data: { userEmail: string, requestType: string, notes?: string }) {
    // Standard 30 day deadline
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + 30);

    const request = await prisma.privacyRequest.create({
      data: {
        ...data,
        deadline,
        status: 'PENDING'
      }
    });

    await AuditLogService.log('CREATE_REQUEST', 'PrivacyRequest', request.id, `Created for ${data.userEmail}`);
    return request;
  }

  static async updateStatus(id: string, status: string) {
    const request = await prisma.privacyRequest.update({
      where: { id },
      data: { status }
    });

    await AuditLogService.log('STATUS_CHANGE', 'PrivacyRequest', id, `Status updated to ${status}`);
    return request;
  }
}
