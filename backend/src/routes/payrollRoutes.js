import { Router } from 'express';
import { ctc, employees, payslip, runPayroll, runs, trend } from '../controllers/payrollController.js';

const router = Router();

router.get('/runs', runs);
router.post('/run', runPayroll);
router.get('/employees', employees);
router.get('/payslips/:employeeId', payslip);
router.get('/trend', trend);
router.get('/ctc-breakdown', ctc);

export default router;
