import { TrackingService } from '../services/tracking.service.js';

const trackingService = new TrackingService();

export class TrackingController {
  async createPixel(req, res, next) {
    try {
      const { name } = req.body;
      const creatorIp = req.ip || req.headers['x-forwarded-for'] || 'unknown';
      const pixel = await trackingService.createPixel(req.user.id, name, creatorIp);
      res.status(201).json(pixel);
    } catch (error) {
      next(error);
    }
  }

  async createLink(req, res, next) {
    try {
      const { name, originalUrl } = req.body;
      const creatorIp = req.ip || req.headers['x-forwarded-for'] || 'unknown';
      const link = await trackingService.createLink(req.user.id, name, originalUrl, creatorIp);
      res.status(201).json(link);
    } catch (error) {
      next(error);
    }
  }

  async getUserPixels(req, res, next) {
    try {
      const pixels = await trackingService.getUserPixels(req.user.id);
      res.json(pixels);
    } catch (error) {
      next(error);
    }
  }

  async getUserLinks(req, res, next) {
    try {
      const links = await trackingService.getUserLinks(req.user.id);
      res.json(links);
    } catch (error) {
      next(error);
    }
  }

  async trackOpen(req, res, next) {
    // Always return a pixel, even if tracking fails
    const pixel = Buffer.from(
      'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
      'base64'
    );

    try {
      const { pixelId } = req.params;
      const forceTest = req.query.force_test === 'true';
      const isProxy = req.headers['user-agent']?.includes('GoogleImageProxy') ||
        req.headers['user-agent']?.includes('via ggpht.com') ||
        req.headers['user-agent']?.includes('Mozilla/5.0 (Windows NT 5.1; rv:11.0)');

      const metadata = {
        ip: req.ip || req.headers['x-forwarded-for'] || 'unknown',
        userAgent: req.headers['user-agent'] || 'unknown',
        isProxy,
        referer: req.headers['referer'] || 'direct',
        openedBySender: !!req.user,
        forceTest,
        headers: {
          'x-forwarded-for': req.headers['x-forwarded-for'],
          'x-real-ip': req.headers['x-real-ip'],
        }
      };

      console.log(`[PIXEL] 📡 Signal detected:`);
      console.log(`  - Pixel ID: ${pixelId}`);
      console.log(`  - IP: ${metadata.ip}`);
      console.log(`  - User-Agent: ${metadata.userAgent}`);
      console.log(`  - Is Proxy: ${isProxy}`);
      console.log(`  - Force Test: ${forceTest}`);
      console.log(`  - Referer: ${metadata.referer}`);

      await trackingService.trackOpen(pixelId, metadata);
      console.log(`[PIXEL] ✅ Tracking recorded successfully`);

    } catch (error) {
      // Log error but still return pixel
      console.error(`[PIXEL] ❌ Error tracking pixel:`, error.message);
      console.error(`[PIXEL] Stack:`, error.stack);
    }

    // Always return the pixel image
    res.writeHead(200, {
      'Content-Type': 'image/gif',
      'Content-Length': pixel.length,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Access-Control-Allow-Origin': '*'
    });
    res.end(pixel);
  }

  async trackClick(req, res, next) {
    try {
      const { linkId } = req.params;
      const metadata = {
        ip: req.ip || req.headers['x-forwarded-for'] || 'unknown',
        userAgent: req.headers['user-agent'] || 'unknown'
      };

      const { event, originalUrl } = await trackingService.trackClick(linkId, metadata);

      res.redirect(originalUrl);
    } catch (error) {
      next(error);
    }
  }

  async getPixelEvents(req, res, next) {
    try {
      const { pixelId } = req.params;
      const { startDate, endDate } = req.query;
      const events = await trackingService.getPixelEvents(pixelId, startDate, endDate);
      res.json(events);
    } catch (error) {
      next(error);
    }
  }

  async getLinkEvents(req, res, next) {
    try {
      const { linkId } = req.params;
      const { startDate, endDate } = req.query;
      const events = await trackingService.getLinkEvents(linkId, startDate, endDate);
      res.json(events);
    } catch (error) {
      next(error);
    }
  }

  async deletePixel(req, res, next) {
    try {
      const { pixelId } = req.params;
      await trackingService.deletePixel(req.user.id, pixelId);
      res.json({ message: 'Pixel deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  async deleteLink(req, res, next) {
    try {
      const { linkId } = req.params;
      await trackingService.deleteLink(req.user.id, linkId);
      res.json({ message: 'Link deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  async deleteEvent(req, res, next) {
    try {
      const { eventId } = req.params;
      await trackingService.deleteEvent(req.user.id, eventId);
      res.json({ message: 'Event deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  async deleteAllEvents(req, res, next) {
    try {
      await trackingService.deleteAllEvents(req.user.id);
      res.json({ message: 'All events deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  async getTrackingConfig(req, res, next) {
    try {
      const { config } = await import('../config/env.js');
      let publicUrl = config.tracking.publicUrl;

      // If not set in production, try to construct from request
      if (!publicUrl && config.server.isProduction) {
        // Use the request's host to construct the URL
        const protocol = req.secure || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
        const host = req.headers['x-forwarded-host'] || req.headers.host;
        publicUrl = `${protocol}://${host}`;
        console.log(`📡 Auto-detected public tracking URL: ${publicUrl}`);
      }

      res.json({
        publicTrackingUrl: publicUrl,
        isProduction: config.server.isProduction
      });
    } catch (error) {
      next(error);
    }
  }
}

