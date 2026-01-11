import api from './api';

export const dashboardService = {
  async getMetrics(startDate, endDate) {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    const response = await api.get('/api/dashboard/metrics', { params });
    return response.data;
  },
};

