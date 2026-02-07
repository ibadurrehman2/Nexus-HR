
import React, { useState, useEffect, createContext, useContext, useMemo } from 'react';
import { HashRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Clock, Banknote, Target, Briefcase, 
  Monitor, GraduationCap, BarChart3, Settings, Menu, X, Bell,
  Search, LogOut, ChevronRight, User as UserIcon, Building2,
  ShieldCheck, HelpCircle, Package, Database, Info, Plus, 
  Filter, MoreVertical, Download, Play, CheckCircle2, AlertCircle,
  FileText, Star, TrendingUp, Calendar, MapPin, Smile, MessageSquare,
  Gift, Megaphone, PieChart, Activity, HardDrive, Shield
} from 'lucide-react';
import { User, Tenant, UserRole, SubscriptionPlan, Employee, JobOpening, Candidate, Course } from './types';
import { APP_MODULES } from './constants';

// --- MOCK DATA ---

const MOCK_TENANT: Tenant = {
  id: 'tnt_1',
  name: 'Global Tech Corp',
  subdomain: 'globaltech',
  plan: SubscriptionPlan.ENTERPRISE,
  enabledModules: APP_MODULES.map(m => m.id)
};

const MOCK_USER: User = {
  id: 'u_1',
  tenantId: 'tnt_1',
  name: 'Alexander Pierce',
  email: 'alex.p@globaltech.com',
  role: UserRole.HR_MANAGER,
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alexander',
  department: 'Human Resources',
  designation: 'Senior HR Operations'
};

const INITIAL_EMPLOYEES: Employee[] = [
  { id: 'e1', employeeId: 'GTC-001', tenantId: 't1', name: 'John Doe', email: 'john@tech.com', role: UserRole.EMPLOYEE, department: 'Engineering', designation: 'Staff Engineer', joinedDate: '2021-01-12', status: 'ACTIVE', salary: 120000, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John' },
  { id: 'e2', employeeId: 'GTC-002', tenantId: 't1', name: 'Sarah Miller', email: 'sarah@tech.com', role: UserRole.EMPLOYEE, department: 'Design', designation: 'UI Designer', joinedDate: '2022-03-05', status: 'ACTIVE', salary: 95000, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
  { id: 'e3', employeeId: 'GTC-003', tenantId: 't1', name: 'Emily Wilson', email: 'emily@tech.com', role: UserRole.RECRUITER, department: 'HR', designation: 'Talent Acquisition', joinedDate: '2023-10-01', status: 'ACTIVE', salary: 75000, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily' },
];

const MOCK_JOBS: JobOpening[] = [
  { id: 'j1', title: 'Senior Product Designer', department: 'Design', location: 'San Francisco', status: 'OPEN', applicants: 45 },
  { id: 'j2', title: 'Full Stack Engineer', department: 'Engineering', location: 'Remote', status: 'OPEN', applicants: 128 },
  { id: 'j3', title: 'HR Business Partner', department: 'Human Resources', location: 'New York', status: 'DRAFT', applicants: 0 },
];

const MOCK_CANDIDATES: Candidate[] = [
  { id: 'c1', name: 'Mark Cuban', email: 'mark@shark.com', status: 'INTERVIEW', appliedFor: 'Senior Product Designer' },
  { id: 'c2', name: 'Linda Yang', email: 'linda@mail.com', status: 'SCREENING', appliedFor: 'Full Stack Engineer' },
  { id: 'c3', name: 'Robert Fox', email: 'rob@fox.com', status: 'OFFER', appliedFor: 'Full Stack Engineer' },
];

const MOCK_COURSES: Course[] = [
  { id: 'cr1', title: 'Cybersecurity Fundamentals', category: 'Compliance', duration: '2h 30m', enrolled: 1240, status: 'REQUIRED' },
  { id: 'cr2', title: 'Leadership Essentials', category: 'Management', duration: '5h 00m', enrolled: 45, status: 'OPTIONAL' },
  { id: 'cr3', title: 'React Performance Tuning', category: 'Engineering', duration: '4h 15m', enrolled: 180, status: 'OPTIONAL' },
];

// --- CONTEXT ---

interface AuthContextType {
  user: User | null;
  tenant: Tenant | null;
  employees: Employee[];
  loading: boolean;
  logout: () => void;
  updateEmployee: (id: string, data: Partial<Employee>) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null, tenant: null, employees: [], loading: false, logout: () => {}, updateEmployee: () => {}
});

const useAuth = () => useContext(AuthContext);

// --- UI HELPERS ---

const Badge = ({ children, variant = 'blue' }: { children: React.ReactNode, variant?: string }) => {
  const styles: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    green: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    red: 'bg-red-50 text-red-600 border-red-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    slate: 'bg-slate-50 text-slate-600 border-slate-100',
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${styles[variant] || styles.blue}`}>
      {children}
    </span>
  );
};

const IconWrapper = ({ name, size = 20, className = "" }: { name: string, size?: number, className?: string }) => {
  const icons: Record<string, React.ElementType> = {
    LayoutDashboard, Users, Clock, Banknote, Target, Briefcase, 
    Monitor, GraduationCap, BarChart3, Settings, Smile, MessageSquare, Gift, Megaphone
  };
  const Icon = icons[name] || Info;
  return <Icon size={size} className={className} />;
};

// --- MODULE: ATTENDANCE ---
const AttendanceModule = () => {
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState<string | null>(null);

  const toggleClock = () => {
    if (!isClockedIn) {
      setClockInTime(new Date().toLocaleTimeString());
    } else {
      setClockInTime(null);
    }
    setIsClockedIn(!isClockedIn);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center">
            <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 transition-all duration-500 ${isClockedIn ? 'bg-emerald-100 text-emerald-600 ring-8 ring-emerald-50' : 'bg-slate-100 text-slate-400'}`}>
              <Clock size={40} className={isClockedIn ? 'animate-pulse' : ''} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">{isClockedIn ? 'Working Now' : 'Off the Clock'}</h3>
            <p className="text-slate-500 text-sm mb-6">
              {isClockedIn ? `Clocked in at ${clockInTime}` : 'Start your shift to track hours.'}
            </p>
            <button 
              onClick={toggleClock}
              className={`w-full py-4 rounded-2xl font-bold transition-all shadow-lg active:scale-95 ${
                isClockedIn 
                ? 'bg-red-50 text-red-600 hover:bg-red-100 shadow-red-100' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100'
              }`}
            >
              {isClockedIn ? 'Punch Out' : 'Punch In'}
            </button>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4">Leave Balances</h4>
            <div className="space-y-4">
              {[
                { type: 'Annual Leave', used: 12, total: 20, color: 'bg-blue-500' },
                { type: 'Sick Leave', used: 2, total: 10, color: 'bg-red-500' },
                { type: 'Personal Day', used: 1, total: 3, color: 'bg-amber-500' },
              ].map((leave, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs font-bold mb-1.5 uppercase text-slate-500">
                    <span>{leave.type}</span>
                    <span>{leave.used}/{leave.total} Days</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${leave.color} transition-all duration-1000`} style={{ width: `${(leave.used/leave.total)*100}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-2.5 border border-slate-200 rounded-xl text-slate-600 text-sm font-semibold hover:bg-slate-50">Request Leave</button>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-800">Recent Logs</h3>
            <button className="text-indigo-600 text-sm font-bold">Download CSV</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase">Date</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase">Check In</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase">Check Out</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase">Duration</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {[
                  { date: 'Oct 24, 2023', in: '09:02 AM', out: '05:45 PM', dur: '8h 43m', status: 'PRESENT' },
                  { date: 'Oct 23, 2023', in: '08:55 AM', out: '06:12 PM', dur: '9h 17m', status: 'PRESENT' },
                  { date: 'Oct 22, 2023', in: '09:15 AM', out: '05:30 PM', dur: '8h 15m', status: 'LATE' },
                  { date: 'Oct 21, 2023', in: '-', out: '-', dur: '-', status: 'ON LEAVE' },
                ].map((log, i) => (
                  <tr key={i} className="text-sm">
                    <td className="px-6 py-4 font-medium text-slate-800">{log.date}</td>
                    <td className="px-6 py-4 text-slate-500">{log.in}</td>
                    <td className="px-6 py-4 text-slate-500">{log.out}</td>
                    <td className="px-6 py-4 text-slate-500">{log.dur}</td>
                    <td className="px-6 py-4">
                      <Badge variant={log.status === 'PRESENT' ? 'green' : log.status === 'LATE' ? 'amber' : 'blue'}>
                        {log.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MODULE: ASSETS ---
const AssetsModule = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Asset Management</h2>
          <p className="text-slate-500">Track company hardware, software, and resources.</p>
        </div>
        <button className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-100 flex items-center gap-2">
          <Plus size={18} /> New Asset
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { name: 'MacBook Pro M2', id: 'AST-042', user: 'John Doe', type: 'Hardware', status: 'ASSIGNED', icon: <Monitor size={20} /> },
          { name: 'Dell UltraSharp 27"', id: 'AST-118', user: 'Sarah Miller', type: 'Hardware', status: 'ASSIGNED', icon: <HardDrive size={20} /> },
          { name: 'Adobe Creative Cloud', id: 'SFT-001', user: 'Sarah Miller', type: 'Software', status: 'ACTIVE', icon: <Shield size={20} /> },
        ].map((asset, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">{asset.icon}</div>
              <Badge variant={asset.status === 'ASSIGNED' || asset.status === 'ACTIVE' ? 'green' : 'amber'}>{asset.status}</Badge>
            </div>
            <h4 className="font-bold text-slate-800 text-lg mb-1">{asset.name}</h4>
            <p className="text-xs text-slate-400 font-bold uppercase mb-4">{asset.id} • {asset.type}</p>
            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
              <div className="flex items-center gap-2">
                 <div className="w-6 h-6 rounded-full bg-slate-100 border border-white flex items-center justify-center text-[8px] font-bold">JD</div>
                 <span className="text-xs text-slate-500 font-medium">Assigned to {asset.user}</span>
              </div>
              <button className="text-indigo-600 text-[10px] font-black uppercase tracking-widest">Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- MODULE: REPORTS ---
const ReportsModule = () => {
  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Analytics & BI</h2>
            <p className="text-slate-500">Real-time workforce data and compliance reports.</p>
          </div>
          <button className="px-5 py-2.5 border border-slate-200 bg-white rounded-xl font-bold text-sm shadow-sm flex items-center gap-2">
             <Download size={18} /> Export All
          </button>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
             <div className="flex items-center justify-between mb-8">
                <h3 className="font-bold text-slate-800">Headcount Growth</h3>
                <div className="flex gap-2">
                   <button className="px-3 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-black rounded-lg">6 MONTHS</button>
                   <button className="px-3 py-1 bg-white border border-slate-100 text-slate-400 text-[10px] font-black rounded-lg">1 YEAR</button>
                </div>
             </div>
             <div className="h-64 flex items-end justify-between gap-4">
                {[40, 55, 45, 75, 90, 100].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-3">
                     <div className="w-full bg-indigo-600 rounded-t-xl transition-all duration-1000" style={{ height: `${h}%` }}></div>
                     <span className="text-[10px] font-bold text-slate-400 uppercase">{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i]}</span>
                  </div>
                ))}
             </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
             <h3 className="font-bold text-slate-800 mb-6">Diversity Metrics</h3>
             <div className="space-y-6">
                {[
                  { label: 'Engineering', val: 65, color: 'bg-indigo-500' },
                  { label: 'Product', val: 42, color: 'bg-emerald-500' },
                  { label: 'Design', val: 58, color: 'bg-purple-500' },
                  { label: 'Sales', val: 30, color: 'bg-amber-500' },
                ].map((m, i) => (
                  <div key={i}>
                     <div className="flex justify-between text-xs font-black uppercase text-slate-500 mb-2">
                        <span>{m.label}</span>
                        <span>{m.val}%</span>
                     </div>
                     <div className="h-2 bg-slate-50 rounded-full overflow-hidden">
                        <div className={`h-full ${m.color}`} style={{ width: `${m.val}%` }}></div>
                     </div>
                  </div>
                ))}
             </div>
             <button className="w-full mt-8 py-3 bg-slate-900 text-white rounded-2xl text-xs font-bold uppercase tracking-widest shadow-xl">Detailed DE&I Report</button>
          </div>
       </div>
    </div>
  );
};

// --- MODULE: RECRUITMENT ---
const RecruitmentModule = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Talent Acquisition</h2>
          <p className="text-slate-500">Manage jobs, candidates, and hiring workflows.</p>
        </div>
        <button className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-100 flex items-center gap-2">
          <Plus size={18} /> Post a Job
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {MOCK_JOBS.map(job => (
          <div key={job.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <Badge variant={job.status === 'OPEN' ? 'green' : 'amber'}>{job.status}</Badge>
              <button className="text-slate-400 hover:text-slate-600"><MoreVertical size={18} /></button>
            </div>
            <h4 className="font-bold text-slate-800 text-lg mb-1">{job.title}</h4>
            <div className="flex items-center gap-4 text-xs text-slate-500 mb-6">
              <span className="flex items-center gap-1"><MapPin size={12} /> {job.location}</span>
              <span className="flex items-center gap-1"><Users size={12} /> {job.applicants} Applied</span>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
               <div className="flex -space-x-2">
                 {[1, 2, 3].map(i => (
                   <img key={i} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+job.id}`} className="w-8 h-8 rounded-full border-2 border-white" alt="" />
                 ))}
                 <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-500">+{job.applicants-3}</div>
               </div>
               <button className="text-indigo-600 font-bold text-sm">View Pipeline</button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
           <h3 className="font-bold text-slate-800">Candidate Pipeline</h3>
           <div className="flex gap-2">
             <button className="p-2 border border-slate-200 rounded-lg bg-white text-slate-400"><Filter size={18} /></button>
             <button className="px-4 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-semibold">Stage: All</button>
           </div>
        </div>
        <div className="p-6 overflow-x-auto">
          <div className="flex gap-6 min-w-[1000px]">
            {['SCREENING', 'INTERVIEW', 'OFFER', 'HIRED'].map(stage => (
              <div key={stage} className="flex-1 space-y-4">
                <div className="flex items-center justify-between px-2 mb-4">
                  <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stage}</h5>
                  <span className="w-5 h-5 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-600">
                    {MOCK_CANDIDATES.filter(c => c.status === stage).length}
                  </span>
                </div>
                {MOCK_CANDIDATES.filter(c => c.status === stage).map(candidate => (
                  <div key={candidate.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 cursor-pointer hover:border-indigo-300 transition-colors group">
                    <p className="font-bold text-slate-800 text-sm group-hover:text-indigo-600">{candidate.name}</p>
                    <p className="text-[10px] text-slate-500 mb-3">{candidate.appliedFor}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(i => <Star key={i} size={8} className={i <= 4 ? 'text-amber-400 fill-amber-400' : 'text-slate-200'} />)}
                      </div>
                      <span className="text-[10px] font-medium text-slate-400">2d ago</span>
                    </div>
                  </div>
                ))}
                <button className="w-full py-3 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-xs font-medium hover:bg-white transition-all">+ Add Candidate</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MODULE: PAYROLL ---
const PayrollModule = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedDate, setProcessedDate] = useState<string | null>(null);

  const handleProcess = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setProcessedDate(new Date().toLocaleDateString());
    }, 2000);
  };

  return (
    <div className="space-y-6">
       <div className="bg-indigo-900 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="space-y-2">
              <span className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-bold uppercase">Next Payroll Run</span>
              <h3 className="text-3xl font-bold">{processedDate ? 'COMPLETED' : 'Oct 31, 2023'}</h3>
              <p className="text-indigo-200 text-sm">{processedDate ? `Processed on ${processedDate}` : 'Cut-off date is Oct 28. Review pending items.'}</p>
            </div>
            <div className="md:border-l md:border-indigo-800 md:pl-8 space-y-1">
              <p className="text-indigo-300 text-xs font-bold uppercase">Estimated Payout</p>
              <h4 className="text-4xl font-bold">$2,148,000.00</h4>
              <p className="text-emerald-400 text-xs flex items-center gap-1 font-bold"><TrendingUp size={12} /> +2.4% from last month</p>
            </div>
            <div className="flex flex-col gap-3">
              <button 
                onClick={handleProcess}
                disabled={isProcessing}
                className={`px-6 py-3 bg-white text-indigo-900 font-bold rounded-xl shadow-xl hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                 {isProcessing ? <Activity className="animate-spin" size={16} /> : <Play size={16} fill="currentColor" />}
                 {isProcessing ? 'Validating Data...' : 'Process Payroll'}
              </button>
              <button className="px-6 py-3 bg-indigo-800 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all border border-indigo-700">
                View Reports
              </button>
            </div>
          </div>
          <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
             <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-800">Salary Components</h3>
                <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg"><Plus size={18} /></button>
             </div>
             <div className="p-6 space-y-4">
                {[
                  { name: 'Basic Salary', type: 'Earnings', amount: 'Base Pay', status: 'Fixed' },
                  { name: 'Housing Allowance', type: 'Earnings', amount: '20%', status: 'Percentage' },
                  { name: 'Income Tax (TDS)', type: 'Deductions', amount: 'Variable', status: 'Compliance' },
                  { name: 'PF / 401k Contribution', type: 'Deductions', amount: '12%', status: 'Fixed' },
                ].map((comp, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl group hover:bg-white border border-transparent hover:border-indigo-100 transition-all">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${comp.type === 'Earnings' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                        {comp.type === 'Earnings' ? <Plus size={20} /> : <Filter size={20} className="rotate-180" />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{comp.name}</p>
                        <p className="text-[10px] text-slate-400 uppercase font-bold">{comp.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                       <p className="text-sm font-bold text-slate-800">{comp.amount}</p>
                       <p className="text-[10px] text-slate-500">{comp.status}</p>
                    </div>
                  </div>
                ))}
             </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
             <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-800">Recent Payslips</h3>
                <button className="text-indigo-600 text-sm font-bold">View History</button>
             </div>
             <div className="divide-y divide-slate-50">
                {[
                  { id: 'PS-102', month: 'September 2023', date: 'Sep 30, 2023', net: '$8,450.00' },
                  { id: 'PS-101', month: 'August 2023', date: 'Aug 31, 2023', net: '$8,450.00' },
                  { id: 'PS-100', month: 'July 2023', date: 'Jul 31, 2023', net: '$8,200.00' },
                ].map((ps, i) => (
                  <div key={i} className="px-6 py-4 flex items-center justify-between group hover:bg-slate-50 cursor-pointer">
                    <div className="flex items-center gap-4">
                       <div className="p-3 bg-slate-100 rounded-xl text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                          <FileText size={20} />
                       </div>
                       <div>
                          <p className="text-sm font-bold text-slate-800">{ps.month}</p>
                          <p className="text-xs text-slate-500">Issued: {ps.date}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-6">
                       <p className="text-sm font-bold text-slate-800">{ps.net}</p>
                       <button className="p-2 text-slate-400 hover:text-indigo-600"><Download size={18} /></button>
                    </div>
                  </div>
                ))}
             </div>
          </div>
       </div>
    </div>
  );
};

// --- MODULE: TALENT ---
const TalentModule = () => {
  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800">Performance Management</h2>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600">Annual Cycle: 2023</button>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold">New Review</button>
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm col-span-1 lg:col-span-1">
             <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-indigo-50 border-2 border-indigo-100 flex items-center justify-center text-indigo-600">
                   <Target size={32} />
                </div>
                <div>
                   <h3 className="font-bold text-slate-800">Your Goals</h3>
                   <p className="text-xs text-slate-500">FY2023 Q4 Review</p>
                </div>
             </div>
             <div className="space-y-6">
                {[
                  { title: 'Increase Engagement', progress: 85, color: 'bg-indigo-500' },
                  { title: 'Hiring Target (10/12)', progress: 75, color: 'bg-emerald-500' },
                  { title: 'Certification Completion', progress: 40, color: 'bg-amber-500' },
                ].map((goal, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-sm font-bold">
                       <span className="text-slate-700">{goal.title}</span>
                       <span className="text-slate-500">{goal.progress}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                       <div className={`h-full ${goal.color}`} style={{ width: `${goal.progress}%` }}></div>
                    </div>
                  </div>
                ))}
             </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm lg:col-span-2 overflow-hidden">
             <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-800">Team Performance Distribution</h3>
                <Badge variant="blue">Normal Bell Curve</Badge>
             </div>
             <div className="p-10 flex items-end justify-center gap-1 md:gap-4 h-64">
                {[20, 45, 90, 60, 30].map((h, i) => (
                  <div key={i} className="flex-1 max-w-[60px] flex flex-col items-center gap-3">
                    <span className="text-[10px] font-bold text-slate-400">{h}%</span>
                    <div className={`w-full rounded-t-xl transition-all hover:opacity-80 cursor-pointer ${
                      i === 2 ? 'bg-indigo-500 h-[200px]' : 'bg-slate-200'
                    }`} style={{ height: i !== 2 ? `${h*2}px` : '180px' }}></div>
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">{['Needs', 'Fair', 'High', 'Elite', 'Top'][i]}</span>
                  </div>
                ))}
             </div>
          </div>
       </div>
    </div>
  );
};

// --- MODULE: EXPERIENCE ---
const ExperienceModule = () => {
  return (
    <div className="space-y-6">
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
             <div className="bg-white rounded-3xl border border-slate-200 p-6 flex items-center gap-4 shadow-sm">
                <img src={MOCK_USER.avatar} className="w-12 h-12 rounded-full border-2 border-indigo-100" />
                <button className="flex-1 px-6 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-left text-slate-400 hover:bg-slate-100 transition-colors">
                  Share an announcement or recognize a teammate...
                </button>
             </div>

             <div className="space-y-6">
                {[
                  { user: 'Emily Wilson', action: 'announced', type: 'Megaphone', title: 'Q4 All Hands Meeting', content: 'Join us this Friday as we discuss our roadmap for 2024 and celebrate our recent wins!', icon: 'indigo' },
                  { user: 'Sarah Miller', action: 'recognized', type: 'Gift', title: 'Outstanding Innovation', content: 'Huge kudos to @JohnDoe for shipping the new performance engine 1 week early! 🚀', icon: 'amber' },
                ].map((post, i) => (
                  <div key={i} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                     <div className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                           <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.user}`} className="w-10 h-10 rounded-full" />
                           <div>
                              <p className="text-sm font-bold text-slate-800">{post.user} <span className="font-normal text-slate-500">{post.action}</span></p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{post.type}</p>
                           </div>
                        </div>
                        <h4 className="font-bold text-slate-800 text-lg mb-2">{post.title}</h4>
                        <p className="text-slate-600 text-sm leading-relaxed mb-6">{post.content}</p>
                        <div className="flex items-center gap-4 pt-6 border-t border-slate-50">
                           <button className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-indigo-600"><Smile size={16} /> Like</button>
                           <button className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-indigo-600"><MessageSquare size={16} /> Comment</button>
                        </div>
                     </div>
                  </div>
                ))}
             </div>
          </div>

          <div className="space-y-6">
             <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-3xl p-6 text-white shadow-xl">
                <div className="flex items-center justify-between mb-6">
                   <h3 className="font-bold">Work Anniversaries</h3>
                   <Calendar size={20} className="text-indigo-300" />
                </div>
                <div className="space-y-4">
                   {[
                     { name: 'John Doe', yrs: 3, date: 'Today' },
                     { name: 'Robert Fox', yrs: 1, date: 'Tomorrow' },
                   ].map((ann, i) => (
                     <div key={i} className="flex items-center gap-3 bg-white/10 p-3 rounded-2xl backdrop-blur-sm">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${ann.name}`} className="w-10 h-10 rounded-xl" />
                        <div className="flex-1">
                           <p className="text-sm font-bold">{ann.name}</p>
                           <p className="text-[10px] text-indigo-200 font-bold uppercase">{ann.yrs} Year Milestone</p>
                        </div>
                        <span className="text-[10px] font-bold bg-white/20 px-2 py-1 rounded-full uppercase tracking-tighter">{ann.date}</span>
                     </div>
                   ))}
                </div>
             </div>

             <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-4">Pulse Survey</h3>
                <div className="bg-slate-50 p-6 rounded-2xl text-center">
                   <p className="text-sm font-bold text-slate-700 mb-6">How was your remote work experience this week?</p>
                   <div className="flex justify-between gap-2">
                     {['😤', '😕', '😐', '🙂', '🤩'].map((emoji, i) => (
                       <button key={i} className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-xl hover:bg-indigo-50 hover:border-indigo-200 transition-all transform hover:-translate-y-1">{emoji}</button>
                     ))}
                   </div>
                   <button className="w-full mt-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-100">Submit Vote</button>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

const EmployeeModule = () => {
  const { employees } = useAuth();
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Employee Directory</h2>
          <p className="text-slate-500">Managing {employees.length} team members.</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
          <Users size={18} /> Add New Employee
        </button>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row gap-4 items-center justify-between">
           <div className="flex items-center gap-4 w-full md:w-auto">
             <div className="bg-white border border-slate-200 rounded-xl px-4 py-2 flex items-center gap-3 flex-1 md:w-80 shadow-sm">
                <Search size={18} className="text-slate-400" />
                <input type="text" placeholder="Search by name, ID, or skills..." className="text-sm bg-transparent focus:outline-none w-full font-medium" />
             </div>
             <button className="p-2.5 border border-slate-200 rounded-xl bg-white text-slate-600 hover:bg-slate-50 transition-colors">
               <Filter size={18} />
             </button>
           </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-slate-400">Team Member</th>
                <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-slate-400">Org Details</th>
                <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-slate-400">Compensation</th>
                <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-slate-400">Lifecycle</th>
                <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-slate-400">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-4">
                      <img src={emp.avatar} alt="" className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-100" />
                      <div>
                        <p className="text-sm font-bold text-slate-800">{emp.name}</p>
                        <p className="text-xs text-slate-400 font-bold">{emp.employeeId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <p className="text-sm font-bold text-slate-700">{emp.department}</p>
                    <p className="text-xs text-slate-500 font-medium">{emp.designation}</p>
                  </td>
                  <td className="px-8 py-4">
                    <p className="text-sm font-bold text-slate-800">${emp.salary?.toLocaleString()}</p>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Monthly</p>
                  </td>
                  <td className="px-8 py-4">
                    <div className="space-y-1.5">
                       <Badge variant={emp.status === 'ACTIVE' ? 'green' : 'amber'}>{emp.status}</Badge>
                       <p className="text-[10px] text-slate-400 font-medium">Joined {emp.joinedDate}</p>
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <button className="p-2 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                      <MoreVertical size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const LMSModule = () => {
  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Learning & Development</h2>
            <p className="text-slate-500">Global training and certification management.</p>
          </div>
          <button className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm flex items-center gap-2">
             <GraduationCap size={18} /> Course Builder
          </button>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_COURSES.map(course => (
            <div key={course.id} className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden group hover:shadow-xl transition-all">
               <div className="h-40 bg-slate-100 relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div className="absolute top-4 right-4">
                     <Badge variant={course.status === 'REQUIRED' ? 'red' : 'indigo'}>{course.status}</Badge>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                     <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-indigo-600 shadow-xl"><Play size={20} className="ml-1" fill="currentColor" /></button>
                  </div>
               </div>
               <div className="p-6">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-widest">{course.category}</p>
                  <h4 className="font-bold text-slate-800 text-lg mb-4 line-clamp-1">{course.title}</h4>
                  <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
                     <span className="flex items-center gap-1.5"><Clock size={14} /> {course.duration}</span>
                     <span className="flex items-center gap-1.5"><Users size={14} /> {course.enrolled} Enrolled</span>
                  </div>
               </div>
            </div>
          ))}
       </div>
    </div>
  );
};

// --- CORE APP STRUCTURE ---

const Sidebar = ({ isOpen, toggle }: { isOpen: boolean, toggle: () => void }) => {
  const { tenant } = useAuth();
  const location = useLocation();

  if (!tenant) return null;

  const modules = APP_MODULES.filter(m => tenant.enabledModules.includes(m.id));

  return (
    <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex flex-col h-full">
        <div className="p-8 flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-[1.25rem] flex items-center justify-center text-white shadow-xl shadow-indigo-100 ring-4 ring-indigo-50">
            <Building2 size={28} />
          </div>
          <div>
            <h1 className="font-black text-2xl text-slate-800 leading-none">Nexus</h1>
            <p className="text-[10px] text-indigo-600 font-black uppercase tracking-[0.2em] mt-1">Enterprise</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-6 py-4 space-y-6 no-scrollbar">
          {['CORE', 'TIME', 'PAYROLL', 'TALENT', 'RECRUITMENT', 'L&D', 'ASSETS', 'ADMIN'].map(category => {
            const categoryModules = modules.filter(m => m.category === category);
            if (categoryModules.length === 0) return null;

            return (
              <div key={category} className="space-y-2">
                <p className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-300 px-3">{category}</p>
                <div className="space-y-1">
                  {categoryModules.map(module => {
                    const isActive = location.pathname === module.path;
                    return (
                      <Link
                        key={module.id}
                        to={module.path}
                        onClick={() => window.innerWidth < 1024 && toggle()}
                        className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                          isActive 
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 translate-x-1' 
                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <IconWrapper name={module.icon} size={20} className={isActive ? 'text-white' : 'text-slate-400'} />
                        {module.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        <div className="p-6">
          <div className="p-4 rounded-3xl bg-slate-900 text-white relative overflow-hidden group cursor-pointer">
             <div className="relative z-10">
               <p className="text-[10px] font-bold uppercase text-indigo-400 mb-1">Organization Plan</p>
               <h4 className="font-bold mb-3">{tenant.plan}</h4>
               <div className="h-1.5 bg-white/10 rounded-full mb-3 overflow-hidden">
                 <div className="h-full bg-indigo-500" style={{ width: '85%' }}></div>
               </div>
               <p className="text-[10px] text-slate-400 font-medium">85% of usage quota reached.</p>
             </div>
             <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-white/5 rounded-full blur-xl group-hover:scale-150 transition-transform"></div>
          </div>
        </div>
      </div>
    </aside>
  );
};

const Header = ({ onToggleSidebar }: { onToggleSidebar: () => void }) => {
  const { user, logout } = useAuth();
  return (
    <header className="sticky top-0 z-40 h-20 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-6 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <button onClick={onToggleSidebar} className="p-2.5 text-slate-500 hover:bg-slate-100 rounded-xl lg:hidden transition-colors">
          <Menu size={24} />
        </button>
        <div className="hidden md:flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-2.5 w-96 group focus-within:ring-4 focus-within:ring-indigo-50 focus-within:border-indigo-200 transition-all">
          <Search size={18} className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          <input type="text" placeholder="Quick search modules, people..." className="bg-transparent border-none focus:outline-none text-sm font-medium w-full" />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative p-2.5 text-slate-400 hover:bg-slate-50 hover:text-slate-600 rounded-xl transition-all">
          <Bell size={22} />
          <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <div className="h-8 w-px bg-slate-200 mx-3 hidden sm:block"></div>
        <div className="flex items-center gap-4 pl-2 cursor-pointer group relative">
          <div className="hidden md:block text-right">
            <p className="text-sm font-black text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors">{user?.name}</p>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{user?.designation}</p>
          </div>
          <img src={user?.avatar} alt="Profile" className="w-12 h-12 rounded-2xl object-cover ring-4 ring-slate-100 shadow-sm" />
          <button 
            onClick={logout}
            className="absolute -top-1 -right-1 p-1.5 bg-white border border-slate-200 rounded-full text-slate-400 opacity-0 group-hover:opacity-100 hover:text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut size={12} />
          </button>
        </div>
      </div>
    </header>
  );
};

const DashboardModule = () => {
  const stats = [
    { label: 'Total Headcount', value: '1,248', change: '+12%', color: 'text-indigo-600', bg: 'bg-indigo-50', icon: 'Users' },
    { label: 'Open Positions', value: '24', change: '+2', color: 'text-blue-600', bg: 'bg-blue-50', icon: 'Briefcase' },
    { label: 'Upcoming Appraisals', value: '18', change: '-3', color: 'text-amber-600', bg: 'bg-amber-50', icon: 'Target' },
    { label: 'Attendance (Today)', value: '94.2%', change: '+1.5%', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: 'Clock' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800">Operational Dashboard</h2>
          <p className="text-slate-500 font-medium">Global Tech Corp • San Francisco HQ • {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-6 py-3 text-sm font-bold text-slate-700 bg-white border border-slate-200 rounded-[1rem] hover:bg-slate-50 transition-all shadow-sm">Audit Log</button>
          <button className="px-6 py-3 text-sm font-bold text-white bg-indigo-600 rounded-[1rem] hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all">Quick Actions</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
            <div className="relative z-10 flex flex-col h-full justify-between">
               <div>
                  <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-6`}>
                     <IconWrapper name={stat.icon} size={24} />
                  </div>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                  <h3 className="text-3xl font-black text-slate-800 tracking-tight">{stat.value}</h3>
               </div>
               <div className="mt-6">
                  <span className={`text-xs font-black px-2.5 py-1 rounded-full ${stat.bg} ${stat.color}`}>
                    {stat.change} vs LY
                  </span>
               </div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-slate-50 rounded-full group-hover:scale-150 transition-transform opacity-50"></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
           <RecruitmentModule />
        </div>
        <div className="space-y-8">
           <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
              <h3 className="font-bold text-slate-800 text-xl mb-6">Upcoming Holidays</h3>
              <div className="space-y-6">
                 {[
                   { name: 'Thanksgiving', date: 'Nov 23', days: '2 days' },
                   { name: 'Winter Break', date: 'Dec 24', days: '7 days' },
                 ].map((h, i) => (
                   <div key={i} className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-slate-50 rounded-2xl flex flex-col items-center justify-center border border-slate-100">
                         <span className="text-[10px] font-black uppercase text-slate-400">{h.date.split(' ')[0]}</span>
                         <span className="text-xl font-black text-slate-800 leading-none">{h.date.split(' ')[1]}</span>
                      </div>
                      <div>
                         <p className="font-bold text-slate-800">{h.name}</p>
                         <p className="text-xs text-slate-500">{h.days} Left</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
           <div className="bg-indigo-50 p-8 rounded-[2rem] border border-indigo-100">
              <h3 className="font-bold text-indigo-900 text-xl mb-2">Help Center</h3>
              <p className="text-indigo-600 text-sm mb-6">Need assistance with your benefits or payroll? Our HR desk is online.</p>
              <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">Chat with HR</button>
           </div>
        </div>
      </div>
    </div>
  );
};

const SettingsModule = () => {
  const { tenant } = useAuth();
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-black text-slate-800">System Configuration</h2>
        <p className="text-slate-500 font-medium">Manage your enterprise environment and multi-tenant rules.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-3 space-y-2">
          {['Organization', 'Billing', 'Modules', 'Security', 'Integrations'].map(t => (
            <button key={t} className={`w-full text-left px-5 py-3 rounded-2xl font-bold text-sm transition-all ${t === 'Modules' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-500 hover:bg-slate-100'}`}>{t}</button>
          ))}
        </div>

        <div className="md:col-span-9 space-y-8">
          <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-bold text-slate-800 text-xl">Module Subscription</h3>
              <Badge variant="green">Scale Plan</Badge>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               {APP_MODULES.map(module => (
                 <div key={module.id} className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl hover:border-indigo-100 transition-all">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400"><IconWrapper name={module.icon} size={20} /></div>
                       <span className="text-sm font-bold text-slate-700">{module.name}</span>
                    </div>
                    <div className={`w-12 h-6 rounded-full relative transition-colors cursor-pointer ${tenant?.enabledModules.includes(module.id) ? 'bg-indigo-500' : 'bg-slate-200'}`}>
                       <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${tenant?.enabledModules.includes(module.id) ? 'left-7' : 'left-1'}`}></div>
                    </div>
                 </div>
               ))}
            </div>

            <div className="mt-10 pt-8 border-t border-slate-100">
               <h4 className="font-bold text-slate-800 mb-6 flex items-center gap-2"><ShieldCheck size={20} className="text-emerald-500" /> Data Sovereignty & Isolation</h4>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tenant Database ID</p>
                     <p className="font-mono text-xs text-slate-700">db_nexus_global_tech_sf_001</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Region</p>
                     <p className="font-mono text-xs text-slate-700">us-west-2 (Oregon)</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setUser(MOCK_USER);
      setTenant(MOCK_TENANT);
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-white">
        <div className="w-20 h-20 relative mb-6">
          <div className="absolute inset-0 border-[6px] border-indigo-50 rounded-[2rem] scale-110"></div>
          <div className="absolute inset-0 border-[6px] border-indigo-600 rounded-[2rem] border-t-transparent animate-spin duration-1000"></div>
          <div className="absolute inset-0 flex items-center justify-center text-indigo-600"><Building2 size={32} /></div>
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">NexusHR</h2>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em] animate-pulse">Mounting Enterprise Environment</p>
        </div>
      </div>
    );
  }

  const updateEmployee = (id: string, data: Partial<Employee>) => {
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, ...data } : e));
  };

  return (
    <AuthContext.Provider value={{ user, tenant, employees, loading, logout: () => setUser(null), updateEmployee }}>
      <HashRouter>
        {user ? (
          <div className="min-h-screen bg-slate-50 flex">
            <Sidebar isOpen={isSidebarOpen} toggle={() => setIsSidebarOpen(false)} />
            
            {isSidebarOpen && (
              <div className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden transition-opacity" onClick={() => setIsSidebarOpen(false)}></div>
            )}

            <div className="flex-1 flex flex-col lg:pl-72 min-w-0">
              <Header onToggleSidebar={() => setIsSidebarOpen(true)} />
              <main className="flex-1 p-6 lg:p-10 overflow-y-auto no-scrollbar">
                <Routes>
                  <Route path="/" element={<DashboardModule />} />
                  <Route path="/employees" element={<EmployeeModule />} />
                  <Route path="/attendance" element={<AttendanceModule />} />
                  <Route path="/payroll" element={<PayrollModule />} />
                  <Route path="/talent" element={<TalentModule />} />
                  <Route path="/recruitment" element={<RecruitmentModule />} />
                  <Route path="/learning" element={<LMSModule />} />
                  <Route path="/experience" element={<ExperienceModule />} />
                  <Route path="/assets" element={<AssetsModule />} />
                  <Route path="/reports" element={<ReportsModule />} />
                  <Route path="/settings" element={<SettingsModule />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
            </div>
          </div>
        ) : (
          <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
            <div className="bg-white p-12 rounded-[3rem] shadow-2xl w-full max-w-xl text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-indigo-600"></div>
              <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center text-white mx-auto mb-8 shadow-2xl shadow-indigo-100">
                <Building2 size={40} />
              </div>
              <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Enterprise Access</h1>
              <p className="text-slate-500 font-medium mb-12 text-lg">Secure workforce management for Global Tech Corp.</p>
              
              <div className="space-y-4">
                 <button onClick={() => setUser(MOCK_USER)} className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 group">
                   Sign In with SSO <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                 </button>
                 <div className="relative py-4">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                    <div className="relative flex justify-center"><span className="bg-white px-4 text-[10px] font-black uppercase text-slate-300 tracking-widest">Or login as Tenant Admin</span></div>
                 </div>
                 <button className="w-full py-4 border-2 border-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-all">Organization ID Login</button>
              </div>
              <p className="mt-12 text-xs text-slate-400 font-bold uppercase tracking-widest">NexusHR Security Protocol v4.2</p>
            </div>
          </div>
        )}
      </HashRouter>
    </AuthContext.Provider>
  );
};

export default App;
