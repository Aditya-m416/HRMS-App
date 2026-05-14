// import { Router } from 'express';
// import { create, destroy, index, show, update } from '../controllers/employeeController.js';

// const router = Router();

// router.get('/', index);
// router.post('/', create);
// router.get('/:id', show);
// router.patch('/:id', update);
// router.delete('/:id', destroy);

// export default router;

import { Router } from 'express';

import {
  create,
  destroy,
  index,
  show,
  update,
} from '../controllers/employeeController.js';

import {
  authorize,
  protect,
} from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', protect, index);
router.get('/:id', protect, show);

router.post(
  '/',
  protect,
  authorize('admin', 'hr'),
  create
);

router.patch(
  '/:id',
  protect,
  authorize('admin', 'hr'),
  update
);

router.delete(
  '/:id',
  protect,
  authorize('admin'),
  destroy
);

export default router;