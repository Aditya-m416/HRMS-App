import { Router } from 'express';

import {
  login,
  profile,
  register,
} from '../controllers/authController.js';

import {
  authorize,
  protect,
} from '../middleware/authMiddleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);

router.get('/profile', protect, profile);

router.get(
  '/admin',
  protect,
  authorize('admin'),
  (req, res) => {
    res.json({
      success: true,
      message: 'Welcome Admin',
    });
  }
);

export default router;