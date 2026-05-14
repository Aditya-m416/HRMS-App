import { Router } from 'express';
import { approve, create, holidayList, index, reject, types, update } from '../controllers/leaveController.js';

const router = Router();

router.get('/types', types);
router.get('/holidays', holidayList);
router.get('/requests', index);
router.post('/requests', create);
router.patch('/requests/:id', update);
router.post('/requests/:id/approve', approve);
router.post('/requests/:id/reject', reject);

export default router;
