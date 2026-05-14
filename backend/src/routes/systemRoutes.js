import { Router } from 'express';
import { departments, health, referenceByKey, reseed, root } from '../controllers/systemController.js';

const router = Router();

router.get('/', root);
router.get('/health', health);
router.get('/reference/:key', referenceByKey);
router.get('/departments', departments);
router.post('/admin/reseed', reseed);

export default router;
