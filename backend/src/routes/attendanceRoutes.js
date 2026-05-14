import { Router } from 'express';
import { checkins, heatmap, shifts, summary, updateCheckin } from '../controllers/attendanceController.js';

const router = Router();

router.get('/summary', summary);
router.get('/shifts', shifts);
router.get('/heatmap', heatmap);
router.get('/checkins', checkins);
router.post('/checkins/:employeeId', updateCheckin);

export default router;
