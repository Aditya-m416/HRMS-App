import { Router } from 'express';
import { index } from '../controllers/performanceController.js';

const router = Router();

router.get('/', index);

export default router;
