import { Router } from 'express';
import { index } from '../controllers/analyticsController.js';

const router = Router();

router.get('/', index);

export default router;
