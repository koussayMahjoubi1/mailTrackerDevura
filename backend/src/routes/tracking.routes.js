import express from 'express';
import { TrackingController } from '../controllers/tracking.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();
const trackingController = new TrackingController();

// Public tracking endpoints (no auth required)
router.get('/pixel/:pixelId', trackingController.trackOpen.bind(trackingController));
router.get('/link/:linkId', trackingController.trackClick.bind(trackingController));

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

export default router;

