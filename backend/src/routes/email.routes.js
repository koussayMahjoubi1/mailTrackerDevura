import express from 'express';
import { EmailController } from '../controllers/email.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();
const emailController = new EmailController();

router.use(authenticate);

router.post('/gmail/connect', emailController.connectGmail.bind(emailController));
router.post('/outlook/connect', emailController.connectOutlook.bind(emailController));
router.post('/imap/connect', emailController.connectIMAP.bind(emailController));

export default router;

