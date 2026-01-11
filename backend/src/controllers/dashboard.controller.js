import { DashboardService } from '../services/dashboard.service.js';

const dashboardService = new DashboardService();

export class DashboardController {
  async getMetrics(req, res, next) {
    try {
      const { startDate, endDate } = req.query;
      const metrics = await dashboardService.getMetrics(
        req.user.id,
        startDate,
        endDate
      );
      res.json(metrics);
    } catch (error) {
      next(error);
    }
  }
}

