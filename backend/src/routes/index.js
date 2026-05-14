import { Router } from 'express';
import analyticsRoutes from './analyticsRoutes.js';
import attendanceRoutes from './attendanceRoutes.js';
import authRoutes from './authRoutes.js';
import employeeRoutes from './employeeRoutes.js';
import leaveRoutes from './leaveRoutes.js';
import onboardingRoutes from './onboardingRoutes.js';
import payrollRoutes from './payrollRoutes.js';
import performanceRoutes from './performanceRoutes.js';
import recruitmentRoutes from './recruitmentRoutes.js';
import systemRoutes from './systemRoutes.js';

const router = Router();

router.use(systemRoutes);
router.use('/auth', authRoutes);
router.use('/employees', employeeRoutes);
router.use('/payroll', payrollRoutes);
router.use('/leave', leaveRoutes);
router.use('/onboarding', onboardingRoutes);
router.use('/recruitment', recruitmentRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/performance', performanceRoutes);
router.use('/analytics', analyticsRoutes);

export default router;
