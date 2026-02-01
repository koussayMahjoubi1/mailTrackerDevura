import api from './api';

export const dashboardService = {
  async getMetrics(startDate, endDate) {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    const response = await api.get('/api/dashboard/metrics', { params });
    return response.data;
  },

  async deleteEvent(eventId) {
    const response = await api.delete(`/api/tracking/events/${eventId}`);
    return response.data;
  },

  async clearAllEvents() {
    const response = await api.delete('/api/tracking/events');
    return response.data;
  }
};

