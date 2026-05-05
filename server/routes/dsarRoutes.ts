import { Router } from 'express';
import { RequestController } from '../controllers/dsarController';

const router = Router();

router.get('/', RequestController.getRequests);
router.get('/:id', RequestController.getRequestById);
router.post('/', RequestController.createRequest);
router.patch('/:id', RequestController.updateRequest);

export default router;
