import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AppProvider } from './context/AppContext';
import { ToastProvider } from './components/ui/Toast';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Payroll from './pages/Payroll';
import Attendance from './pages/Attendance';
import Leave from './pages/Leave';
import Performance from './pages/Performance';
import Recruitment from './pages/Recruitment';
import Onboarding from './pages/Onboarding';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

const pageVariants = {
  initial: { opacity: 0, y: 16, scale: 0.99 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit:    { opacity: 0, y: -8, scale: 0.99, transition: { duration: 0.18 } },
};

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div key={location.pathname} variants={pageVariants} initial="initial" animate="animate" exit="exit" style={{ height: '100%' }}>
        <Routes location={location}>
          <Route element={<Layout />}>
            <Route path="/dashboard"  element={<Dashboard />} />
            <Route path="/employees"  element={<Employees />} />
            <Route path="/payroll"    element={<Payroll />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/leave"      element={<Leave />} />
            <Route path="/performance" element={<Performance />} />
            <Route path="/recruitment" element={<Recruitment />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/analytics"  element={<Analytics />} />
            <Route path="/settings"   element={<Settings />} />
            <Route path="*" element={
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'60vh', gap:16 }}>
                <div style={{ fontSize:64, fontWeight:800, fontFamily:'var(--font-display)', color:'var(--primary)', lineHeight:1 }}>404</div>
                <div style={{ fontSize:20, fontWeight:600 }}>Page not found</div>
                <a href="/dashboard" className="btn btn-primary" style={{ marginTop:8 }}>Go to Dashboard</a>
              </div>
            } />
          </Route>
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <AppProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/*" element={<AnimatedRoutes />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AppProvider>
  );
}
