
export enum UserRole {
  ADMIN = 'ADMIN',
  HR_MANAGER = 'HR_MANAGER',
  EMPLOYEE = 'EMPLOYEE',
  RECRUITER = 'RECRUITER'
}

export enum SubscriptionPlan {
  BASIC = 'BASIC',
  PROFESSIONAL = 'PROFESSIONAL',
  ENTERPRISE = 'ENTERPRISE'
}

export interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  plan: SubscriptionPlan;
  enabledModules: string[];
}

export interface User {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  designation?: string;
}

export interface Employee extends User {
  employeeId: string;
  joinedDate: string;
  status: 'ACTIVE' | 'ONBOARDING' | 'EXITED';
  managerId?: string;
  salary?: number;
}

export interface ModuleConfig {
  id: string;
  name: string;
  icon: string;
  path: string;
  category: 'CORE' | 'TIME' | 'PAYROLL' | 'TALENT' | 'RECRUITMENT' | 'ADMIN' | 'L&D' | 'ASSETS';
  minPlan: SubscriptionPlan;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'ON_LEAVE';
}

export interface JobOpening {
  id: string;
  title: string;
  department: string;
  location: string;
  status: 'OPEN' | 'CLOSED' | 'DRAFT';
  applicants: number;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  status: 'SCREENING' | 'INTERVIEW' | 'OFFER' | 'HIRED' | 'REJECTED';
  appliedFor: string;
}

export interface Course {
  id: string;
  title: string;
  category: string;
  duration: string;
  enrolled: number;
  status: 'REQUIRED' | 'OPTIONAL';
}
