import cron from 'node-cron';
import { prisma } from '../lib/prisma';
import { AlertService } from './alertService';

export class CronService {
  static async checkOverdueRequests() {
    console.log('[CRON] Checking for overdue privacy requests...');
    const now = new Date();

    try {
      const overdueRequests = await prisma.privacyRequest.findMany({
        where: {
          deadline: { lt: now },
          status: { notIn: ['COMPLETED', 'OVERDUE'] }
        }
      });

      if (overdueRequests.length === 0) {
        console.log('[CRON] No new overdue requests found.');
        return;
      }

      console.log(`[CRON] Found ${overdueRequests.length} overdue requests.`);

      for (const request of overdueRequests) {
        await prisma.$transaction([
          prisma.privacyRequest.update({
            where: { id: request.id },
            data: { status: 'OVERDUE' }
          }),
          prisma.alert.create({
            data: {
              type: 'OVERDUE',
              message: `Privacy Request ${request.id.slice(0, 8)} for ${request.userEmail} is now overdue.`,
              privacyRequestId: request.id
            }
          })
        ]);
        console.log(`[CRON] Marked request ${request.id} as OVERDUE and created alert.`);
      }
    } catch (error) {
      console.error('[CRON] Error checking overdue requests:', error);
    }
  }

  static start() {
    // Run at midnight every day
    cron.schedule('0 0 * * *', () => {
      this.checkOverdueRequests();
    });

    // Run once at startup
    this.checkOverdueRequests();
    console.log('[CRON] Service initialized.');
  }
}
