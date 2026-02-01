import express from 'express';
import { TrackingController } from '../controllers/tracking.controller.js';
import { authenticate, optionalAuthenticate } from '../middleware/auth.middleware.js';

const router = express.Router();
const trackingController = new TrackingController();

// Public tracking endpoints (no auth strictly required, but optional for self-detection)
router.get('/pixel/:pixelId', optionalAuthenticate, trackingController.trackOpen.bind(trackingController));
router.get('/link/:linkId', optionalAuthenticate, trackingController.trackClick.bind(trackingController));

// Protected endpoints (require auth)
router.use(authenticate);

router.post('/pixel', trackingController.createPixel.bind(trackingController));
router.post('/link', trackingController.createLink.bind(trackingController));
router.get('/pixels', trackingController.getUserPixels.bind(trackingController));
router.get('/links', trackingController.getUserLinks.bind(trackingController));
router.delete('/pixel/:pixelId', trackingController.deletePixel.bind(trackingController));
router.delete('/link/:linkId', trackingController.deleteLink.bind(trackingController));
router.get('/pixel/:pixelId/events', trackingController.getPixelEvents.bind(trackingController));
router.get('/link/:linkId/events', trackingController.getLinkEvents.bind(trackingController));

// Event Management
router.delete('/events/:eventId', trackingController.deleteEvent.bind(trackingController));
router.delete('/events', trackingController.deleteAllEvents.bind(trackingController));

// Configuration endpoint (returns public tracking URL)
router.get('/config', trackingController.getTrackingConfig.bind(trackingController));

export default router;

