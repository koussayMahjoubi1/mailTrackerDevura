import { TrackingRepository } from '../repositories/tracking.repository.js';

const trackingRepo = new TrackingRepository();

export class DashboardService {
  async getMetrics(userId, startDate, endDate) {
    const events = await trackingRepo.getUserEvents(userId, startDate, endDate);

    // Get all pixels and links for this user
    const pixels = await trackingRepo.getUserPixels(userId);
    const links = await trackingRepo.getUserLinks(userId);

    // Calculate metrics
    const opens = events.filter(e => e.event_type === 'open');
    const clicks = events.filter(e => e.event_type === 'click');
    const replies = events.filter(e => e.event_type === 'reply');

    // Calculate rates
    const totalEmailsSent = pixels.length; // Simplified - in production, track actual sends
    const openRate = totalEmailsSent > 0 ? (opens.length / totalEmailsSent) * 100 : 0;
    const clickRate = totalEmailsSent > 0 ? (clicks.length / totalEmailsSent) * 100 : 0;
    const replyRate = totalEmailsSent > 0 ? (replies.length / totalEmailsSent) * 100 : 0;

    // Group events by date
    const eventsByDate = this.groupEventsByDate(events);

    return {
      summary: {
        totalOpens: opens.length,
        totalClicks: clicks.length,
        totalReplies: replies.length,
        openRate: Math.round(openRate * 100) / 100,
        clickRate: Math.round(clickRate * 100) / 100,
        replyRate: Math.round(replyRate * 100) / 100,
        totalPixels: pixels.length,
        totalLinks: links.length
      },
      eventsByDate,
      recentEvents: events.slice(0, 50) // Last 50 events
    };
  }

  groupEventsByDate(events) {
    const grouped = {};

    events.forEach(event => {
      const date = new Date(event.created_at).toISOString().split('T')[0];
      if (!grouped[date]) {
        grouped[date] = { opens: 0, clicks: 0, replies: 0 };
      }
      grouped[date][event.event_type + 's']++;
    });

    return Object.entries(grouped)
      .map(([date, counts]) => ({
        date,
        ...counts
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }
}

