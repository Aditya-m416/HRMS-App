import { createContext, useContext, useReducer, useEffect } from 'react';

const AppContext = createContext(null);

const initialState = {
  user: null,               // logged in user (from API)
  token: null,              // JWT token
  sidebarCollapsed: false,
  mobileNavOpen: false,
  theme: 'dark',            // 'dark' | 'light'
  notifications: [
    { id: 1, type: 'leave', text: 'Rohit Bansal applied for leave', read: false, time: '10m ago' },
    { id: 2, type: 'hire', text: 'Aryan Kapoor accepted offer letter', read: false, time: '1h ago' },
    { id: 3, type: 'payroll', text: 'March payroll processed successfully', read: true, time: '3h ago' },
    { id: 4, type: 'alert', text: '3 employees checked in late today', read: true, time: '8h ago' },
  ],
};

function reducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload.user, token: action.payload.token };
    case 'LOGOUT':
      return { ...state, user: null, token: null };
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarCollapsed: !state.sidebarCollapsed };
    case 'TOGGLE_MOBILE_NAV':
      return { ...state, mobileNavOpen: !state.mobileNavOpen };
    case 'CLOSE_MOBILE_NAV':
      return { ...state, mobileNavOpen: false };
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(n =>
          n.id === action.payload ? { ...n, read: true } : n
        )
      };
    case 'MARK_ALL_READ':
      return {
        ...state,
        notifications: state.notifications.map(n => ({ ...n, read: true }))
      };
    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme === 'dark' ? 'light' : 'dark' };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState, (init) => {
    try {
      const saved = localStorage.getItem('nexushr_user');
      const token = localStorage.getItem('nexushr_token');
      const theme = localStorage.getItem('nexushr_theme') || 'dark';
      return { ...init, user: saved ? JSON.parse(saved) : null, token: token || null, theme };
    } catch {
      return init;
    }
  });

  useEffect(() => {
    if (state.user) {
      localStorage.setItem('nexushr_user', JSON.stringify(state.user));
    } else {
      localStorage.removeItem('nexushr_user');
    }
  }, [state.user]);

  useEffect(() => {
    if (state.token) {
      localStorage.setItem('nexushr_token', state.token);
    } else {
      localStorage.removeItem('nexushr_token');
    }
  }, [state.token]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme);
    localStorage.setItem('nexushr_theme', state.theme);
  }, [state.theme]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

// ── Role-based permission hook ─────────────────────────────────────
// Returns capability flags derived from the current user's role.
// hr_admin : full access
// manager  : can edit employees, approve leaves, but cannot ADD or DELETE employees
// employee : read-only (self-service only)
export function usePermission() {
  const { state } = useApp();
  const role = state.user?.id || 'employee';

  const isAdmin   = role === 'hr_admin';
  const isManager = role === 'manager';
  const isEmployee = role === 'employee';

  return {
    role,
    isAdmin,
    isManager,
    isEmployee,

    // Employee directory
    canAddEmployee:    isAdmin,                  // HR Admin only
    canDeleteEmployee: isAdmin,                  // HR Admin only
    canEditEmployee:   isAdmin || isManager,     // Admin + Manager
    canExportData:     isAdmin || isManager,

    // Payroll
    canRunPayroll:     isAdmin,
    canViewPayslips:   true,                     // everyone

    // Leave
    canApproveLeave:   isAdmin || isManager,
    canApplyLeave:     true,                     // everyone

    // General
    canViewAnalytics:  isAdmin || isManager,
    canManageSettings: isAdmin,
  };
}

export const roles = [
  {
    id: 'hr_admin',
    label: 'HR Admin',
    name: 'Priya Patel',
    email: 'priya.patel@nexushr.com',
    avatar: null,
    initials: 'PP',
    employeeId: 'E002',
    permissions: ['all'],
  },
  {
    id: 'manager',
    label: 'Manager',
    name: 'Arjun Sharma',
    email: 'arjun.sharma@nexushr.com',
    avatar: null,
    initials: 'AS',
    employeeId: 'E001',
    permissions: ['view_team', 'approve_leave', 'submit_feedback'],
  },
  {
    id: 'employee',
    label: 'Employee',
    name: 'Ravi Kumar',
    email: 'ravi.kumar@nexushr.com',
    avatar: null,
    initials: 'RK',
    employeeId: 'E003',
    permissions: ['view_self', 'apply_leave', 'view_payslip'],
  },
];
