import { Router } from 'express';
import { AlertController } from '../controllers/alertController';

const router = Router();

router.get('/', AlertController.getAlerts);
router.patch('/:id/read', AlertController.markRead);

export default router;
