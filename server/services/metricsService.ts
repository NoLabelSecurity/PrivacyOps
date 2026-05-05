import { prisma } from '../lib/prisma';

export class MetricsService {
  static async getDashboardMetrics() {
    const now = new Date();

    const [total, pending, overdue, completed] = await Promise.all([
      prisma.privacyRequest.count(),
      prisma.privacyRequest.count({ where: { status: 'PENDING' } }),
      prisma.privacyRequest.count({ 
        where: { 
          deadline: { lt: now },
          status: { not: 'COMPLETED' }
        } 
      }),
      prisma.privacyRequest.findMany({
        where: { status: 'COMPLETED' },
        select: { createdAt: true, updatedAt: true }
      })
    ]);

    // Average processing time in days
    let avgProcessingTime = 0;
    if (completed.length > 0) {
      const totalTime = completed.reduce((acc, curr) => {
        return acc + (curr.updatedAt.getTime() - curr.createdAt.getTime());
      }, 0);
      avgProcessingTime = totalTime / completed.length / (1000 * 60 * 60 * 24);
    }

    // Status distribution for Pie Chart
    const statusGroups = await prisma.privacyRequest.groupBy({
      by: ['status'],
      _count: true
    });
    const statusData = statusGroups.map(g => ({ name: g.status, value: g._count }));

    // Requests over time (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    // Simple grouping by date
    const requestsLast7Days = await prisma.privacyRequest.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      select: { createdAt: true }
    });

    const timeSeriesData = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const count = requestsLast7Days.filter(r => r.createdAt.toISOString().split('T')[0] === dateStr).length;
      return { date: dateStr, count };
    }).reverse();

    return {
      total,
      pending,
      overdue,
      avgProcessingTime: parseFloat(avgProcessingTime.toFixed(1)),
      statusData,
      timeSeriesData
    };
  }
}
