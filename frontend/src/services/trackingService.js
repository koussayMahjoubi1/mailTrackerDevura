import api from './api';

export const trackingService = {
  async createPixel(name) {
    const response = await api.post('/api/tracking/pixel', { name });
    return response.data;
  },

  async createLink(name, originalUrl) {
    const response = await api.post('/api/tracking/link', { name, originalUrl });
    return response.data;
  },

  async getPixels() {
    const response = await api.get('/api/tracking/pixels');
    return response.data;
  },

  async getLinks() {
    const response = await api.get('/api/tracking/links');
    return response.data;
  },

  async getPixelEvents(pixelId, startDate, endDate) {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    const response = await api.get(`/api/tracking/pixel/${pixelId}/events`, { params });
    return response.data;
  },

  async getLinkEvents(linkId, startDate, endDate) {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    const response = await api.get(`/api/tracking/link/${linkId}/events`, { params });
    return response.data;
  },

  async deletePixel(pixelId) {
    const response = await api.delete(`/api/tracking/pixel/${pixelId}`);
    return response.data;
  },

  async deleteLink(linkId) {
    const response = await api.delete(`/api/tracking/link/${linkId}`);
    return response.data;
  },

  async getTrackingConfig() {
    const response = await api.get('/api/tracking/config');
    return response.data;
  },
};

