import { Router } from 'express';
import { candidates, jobs, stages, updateStage } from '../controllers/recruitmentController.js';

const router = Router();

router.get('/jobs', jobs);
router.get('/candidates', candidates);
router.patch('/candidates/:id/stage', updateStage);
router.get('/stages', stages);

export default router;
