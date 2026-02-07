
import { ModuleConfig, SubscriptionPlan } from './types';

export const APP_MODULES: ModuleConfig[] = [
  { id: 'dashboard', name: 'Overview', icon: 'LayoutDashboard', path: '/', category: 'CORE', minPlan: SubscriptionPlan.BASIC },
  { id: 'employees', name: 'People Directory', icon: 'Users', path: '/employees', category: 'CORE', minPlan: SubscriptionPlan.BASIC },
  { id: 'attendance', name: 'Attendance & Time', icon: 'Clock', path: '/attendance', category: 'TIME', minPlan: SubscriptionPlan.BASIC },
  { id: 'payroll', name: 'Payroll & Compensation', icon: 'Banknote', path: '/payroll', category: 'PAYROLL', minPlan: SubscriptionPlan.PROFESSIONAL },
  { id: 'talent', name: 'Performance & Goals', icon: 'Target', path: '/talent', category: 'TALENT', minPlan: SubscriptionPlan.PROFESSIONAL },
  { id: 'recruitment', name: 'Recruitment (ATS)', icon: 'Briefcase', path: '/recruitment', category: 'RECRUITMENT', minPlan: SubscriptionPlan.PROFESSIONAL },
  { id: 'learning', name: 'L&D / Academy', icon: 'GraduationCap', path: '/learning', category: 'L&D', minPlan: SubscriptionPlan.PROFESSIONAL },
  { id: 'assets', name: 'Asset Management', icon: 'Monitor', path: '/assets', category: 'ASSETS', minPlan: SubscriptionPlan.ENTERPRISE },
  { id: 'experience', name: 'Engagement & Help', icon: 'Smile', path: '/experience', category: 'CORE', minPlan: SubscriptionPlan.BASIC },
  { id: 'reports', name: 'Analytics & BI', icon: 'BarChart3', path: '/reports', category: 'ADMIN', minPlan: SubscriptionPlan.PROFESSIONAL },
  { id: 'settings', name: 'Global Settings', icon: 'Settings', path: '/settings', category: 'ADMIN', minPlan: SubscriptionPlan.BASIC },
];
