import { TrackingRepository } from '../repositories/tracking.repository.js';
import { NotificationService } from './notification.service.js';

const trackingRepo = new TrackingRepository();
const notificationService = new NotificationService();

export class TrackingService {
  async createPixel(userId, name) {
    return await trackingRepo.createTrackingPixel(userId, name);
  }

  async createLink(userId, name, originalUrl) {
    return await trackingRepo.createTrackingLink(userId, name, originalUrl);
  }

  async trackOpen(pixelId, metadata = {}) {
    const event = await trackingRepo.recordOpen(pixelId, {
      ...metadata,
      ip: metadata.ip || 'unknown',
      userAgent: metadata.userAgent || 'unknown',
      timestamp: new Date().toISOString()
    });

    // Get pixel info for notification
    const pixel = await trackingRepo.getTrackingPixel(pixelId);
    
    // Send notification
    await notificationService.sendOpenNotification(pixel.user_id, pixel, event);

    return event;
  }

  async trackClick(linkId, metadata = {}) {
    const link = await trackingRepo.getTrackingLink(linkId);
    const event = await trackingRepo.recordClick(linkId, {
      ...metadata,
      ip: metadata.ip || 'unknown',
      userAgent: metadata.userAgent || 'unknown',
      timestamp: new Date().toISOString()
    });

    // Send notification
    await notificationService.sendClickNotification(link.user_id, link, event);

    return { event, originalUrl: link.original_url };
  }

  async trackReply(pixelId, metadata = {}) {
    const event = await trackingRepo.recordReply(pixelId, {
      ...metadata,
      timestamp: new Date().toISOString()
    });

    const pixel = await trackingRepo.getTrackingPixel(pixelId);
    
    // Send notification
    await notificationService.sendReplyNotification(pixel.user_id, pixel, event);

    return event;
  }

  async getUserPixels(userId) {
    return await trackingRepo.getUserPixels(userId);
  }

  async getUserLinks(userId) {
    return await trackingRepo.getUserLinks(userId);
  }

  async getPixelEvents(pixelId, startDate, endDate) {
    return await trackingRepo.getEventsByPixel(pixelId, startDate, endDate);
  }

  async getLinkEvents(linkId, startDate, endDate) {
    return await trackingRepo.getEventsByLink(linkId, startDate, endDate);
  }

  async deletePixel(userId, pixelId) {
    return await trackingRepo.deletePixel(userId, pixelId);
  }

  async deleteLink(userId, linkId) {
    return await trackingRepo.deleteLink(userId, linkId);
  }
}

