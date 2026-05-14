import { Router } from 'express';
import { exits, joiners, tasks, toggleTask } from '../controllers/onboardingController.js';

const router = Router();

router.get('/tasks', tasks);
router.patch('/tasks/:id/toggle', toggleTask);
router.get('/new-joiners', joiners);
router.get('/exits', exits);

export default router;
