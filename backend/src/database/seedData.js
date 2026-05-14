// ============================================
// NEXUSHR — MOCK DATA
// 50+ realistic employees + all HR data
// ============================================

export const departments = [
  'Engineering', 'Product', 'Design', 'Marketing', 'Sales',
  'HR', 'Finance', 'Operations', 'Customer Success', 'Legal'
];

export const employees = [
  { id: 'E001', name: 'Arjun Sharma', role: 'VP of Engineering', dept: 'Engineering', email: 'arjun.sharma@nexushr.com', phone: '+91 98765 43210', location: 'Bangalore', status: 'active', joinDate: '2019-03-15', salary: 3600000, manager: null, reportees: ['E003','E005','E007'], avatar: null, initials: 'AS', skills: ['React','Node.js','Architecture'], level: 'L7' },
  { id: 'E002', name: 'Priya Patel', role: 'HR Director', dept: 'HR', email: 'priya.patel@nexushr.com', phone: '+91 87654 32109', location: 'Mumbai', status: 'active', joinDate: '2018-07-01', salary: 2800000, manager: null, reportees: ['E010','E012'], avatar: null, initials: 'PP', skills: ['HR Strategy','Compliance','Talent Acquisition'], level: 'L7' },
  { id: 'E003', name: 'Ravi Kumar', role: 'Senior Frontend Engineer', dept: 'Engineering', email: 'ravi.kumar@nexushr.com', phone: '+91 76543 21098', location: 'Bangalore', status: 'active', joinDate: '2021-01-10', salary: 1800000, manager: 'E001', reportees: ['E015','E016'], avatar: null, initials: 'RK', skills: ['React','TypeScript','GraphQL'], level: 'L5' },
  { id: 'E004', name: 'Sneha Reddy', role: 'Product Manager', dept: 'Product', email: 'sneha.reddy@nexushr.com', phone: '+91 65432 10987', location: 'Hyderabad', status: 'active', joinDate: '2020-05-20', salary: 2200000, manager: null, reportees: ['E017','E018'], avatar: null, initials: 'SR', skills: ['Product Strategy','Agile','User Research'], level: 'L6' },
  { id: 'E005', name: 'Vikram Singh', role: 'Backend Engineer', dept: 'Engineering', email: 'vikram.singh@nexushr.com', phone: '+91 54321 09876', location: 'Pune', status: 'active', joinDate: '2022-03-01', salary: 1400000, manager: 'E001', reportees: [], avatar: null, initials: 'VS', skills: ['Node.js','PostgreSQL','Redis'], level: 'L4' },
  { id: 'E006', name: 'Ananya Krishnan', role: 'UX Designer', dept: 'Design', email: 'ananya.k@nexushr.com', phone: '+91 43210 98765', location: 'Chennai', status: 'active', joinDate: '2021-08-15', salary: 1600000, manager: null, reportees: [], avatar: null, initials: 'AK', skills: ['Figma','User Research','Prototyping'], level: 'L5' },
  { id: 'E007', name: 'Rahul Mehra', role: 'DevOps Engineer', dept: 'Engineering', email: 'rahul.mehra@nexushr.com', phone: '+91 32109 87654', location: 'Bangalore', status: 'active', joinDate: '2020-11-05', salary: 1700000, manager: 'E001', reportees: [], avatar: null, initials: 'RM', skills: ['Kubernetes','Docker','AWS'], level: 'L5' },
  { id: 'E008', name: 'Kavya Nair', role: 'Marketing Manager', dept: 'Marketing', email: 'kavya.nair@nexushr.com', phone: '+91 21098 76543', location: 'Kochi', status: 'active', joinDate: '2019-09-01', salary: 1500000, manager: null, reportees: ['E019'], avatar: null, initials: 'KN', skills: ['SEO','Content Strategy','Analytics'], level: 'L5' },
  { id: 'E009', name: 'Suresh Iyer', role: 'Sales Director', dept: 'Sales', email: 'suresh.iyer@nexushr.com', phone: '+91 10987 65432', location: 'Delhi', status: 'active', joinDate: '2018-02-14', salary: 2600000, manager: null, reportees: ['E020','E021'], avatar: null, initials: 'SI', skills: ['Enterprise Sales','CRM','Negotiation'], level: 'L7' },
  { id: 'E010', name: 'Deepa Joshi', role: 'HR Business Partner', dept: 'HR', email: 'deepa.joshi@nexushr.com', phone: '+91 99887 66554', location: 'Mumbai', status: 'active', joinDate: '2020-06-01', salary: 1200000, manager: 'E002', reportees: [], avatar: null, initials: 'DJ', skills: ['Employee Relations','L&D','HR Analytics'], level: 'L4' },
  { id: 'E011', name: 'Amit Desai', role: 'Finance Manager', dept: 'Finance', email: 'amit.desai@nexushr.com', phone: '+91 88776 55443', location: 'Mumbai', status: 'active', joinDate: '2019-11-20', salary: 1900000, manager: null, reportees: [], avatar: null, initials: 'AD', skills: ['Financial Planning','Taxation','Audit'], level: 'L5' },
  { id: 'E012', name: 'Pooja Verma', role: 'Talent Acquisition Lead', dept: 'HR', email: 'pooja.verma@nexushr.com', phone: '+91 77665 44332', location: 'Bangalore', status: 'active', joinDate: '2021-04-15', salary: 1100000, manager: 'E002', reportees: [], avatar: null, initials: 'PV', skills: ['Sourcing','Interview Design','Employer Branding'], level: 'L4' },
  { id: 'E013', name: 'Kiran Rao', role: 'Customer Success Manager', dept: 'Customer Success', email: 'kiran.rao@nexushr.com', phone: '+91 66554 33221', location: 'Hyderabad', status: 'active', joinDate: '2022-01-10', salary: 1300000, manager: null, reportees: [], avatar: null, initials: 'KR', skills: ['Account Management','NPS','SaaS'], level: 'L4' },
  { id: 'E014', name: 'Nisha Gupta', role: 'Legal Counsel', dept: 'Legal', email: 'nisha.gupta@nexushr.com', phone: '+91 55443 22110', location: 'Delhi', status: 'active', joinDate: '2020-08-01', salary: 2100000, manager: null, reportees: [], avatar: null, initials: 'NG', skills: ['Corporate Law','IP','Contracts'], level: 'L6' },
  { id: 'E015', name: 'Akash Tiwari', role: 'Frontend Engineer', dept: 'Engineering', email: 'akash.tiwari@nexushr.com', phone: '+91 44332 11009', location: 'Bangalore', status: 'active', joinDate: '2022-09-01', salary: 1100000, manager: 'E003', reportees: [], avatar: null, initials: 'AT', skills: ['React','CSS','Testing'], level: 'L3' },
  { id: 'E016', name: 'Meera Shah', role: 'Frontend Engineer', dept: 'Engineering', email: 'meera.shah@nexushr.com', phone: '+91 33221 00998', location: 'Pune', status: 'on_leave', joinDate: '2023-01-15', salary: 1000000, manager: 'E003', reportees: [], avatar: null, initials: 'MS', skills: ['Vue.js','JavaScript','REST APIs'], level: 'L3' },
  { id: 'E017', name: 'Rohit Bansal', role: 'Associate PM', dept: 'Product', email: 'rohit.bansal@nexushr.com', phone: '+91 22110 99887', location: 'Bangalore', status: 'active', joinDate: '2022-07-01', salary: 1500000, manager: 'E004', reportees: [], avatar: null, initials: 'RB', skills: ['Roadmapping','JIRA','Data Analysis'], level: 'L4' },
  { id: 'E018', name: 'Tanya Singh', role: 'Senior Designer', dept: 'Design', email: 'tanya.singh@nexushr.com', phone: '+91 11009 88776', location: 'Mumbai', status: 'active', joinDate: '2021-11-01', salary: 1400000, manager: 'E004', reportees: [], avatar: null, initials: 'TS', skills: ['UI Design','Motion','Illustration'], level: 'L5' },
  { id: 'E019', name: 'Lakshmi Bhatt', role: 'Content Strategist', dept: 'Marketing', email: 'lakshmi.bhatt@nexushr.com', phone: '+91 00998 77665', location: 'Chennai', status: 'active', joinDate: '2023-03-01', salary: 800000, manager: 'E008', reportees: [], avatar: null, initials: 'LB', skills: ['Copywriting','SEO','Social Media'], level: 'L3' },
  { id: 'E020', name: 'Sanjay Kapoor', role: 'Account Executive', dept: 'Sales', email: 'sanjay.kapoor@nexushr.com', phone: '+91 99776 55443', location: 'Delhi', status: 'active', joinDate: '2022-05-15', salary: 1000000, manager: 'E009', reportees: [], avatar: null, initials: 'SK', skills: ['B2B Sales','Demo','Pipeline Management'], level: 'L3' },
  { id: 'E021', name: 'Divya Menon', role: 'Sales Development Rep', dept: 'Sales', email: 'divya.menon@nexushr.com', phone: '+91 88665 44332', location: 'Bangalore', status: 'active', joinDate: '2023-06-01', salary: 700000, manager: 'E009', reportees: [], avatar: null, initials: 'DM', skills: ['Cold Outreach','LinkedIn','Sales Tools'], level: 'L2' },
  { id: 'E022', name: 'Pranav Jain', role: 'Data Analyst', dept: 'Operations', email: 'pranav.jain@nexushr.com', phone: '+91 77554 33221', location: 'Hyderabad', status: 'active', joinDate: '2021-10-01', salary: 1300000, manager: null, reportees: [], avatar: null, initials: 'PJ', skills: ['Python','SQL','Tableau'], level: 'L4' },
  { id: 'E023', name: 'Asha Pillai', role: 'Operations Manager', dept: 'Operations', email: 'asha.pillai@nexushr.com', phone: '+91 66443 22110', location: 'Kochi', status: 'inactive', joinDate: '2018-12-01', salary: 1600000, manager: null, reportees: [], avatar: null, initials: 'AP', skills: ['Process Improvement','Lean','Project Management'], level: 'L5' },
];

export const getEmployeeById = (id) => employees.find(e => e.id === id);

// ============================================
// PAYROLL DATA
// ============================================

export const payrollRuns = [
  { id: 'PR001', month: 'March 2024', status: 'completed', totalEmployees: 23, totalGross: 38500000, totalDeductions: 4200000, totalNet: 34300000, processedOn: '2024-03-28', approvedBy: 'Priya Patel' },
  { id: 'PR002', month: 'February 2024', status: 'completed', totalEmployees: 22, totalGross: 37200000, totalDeductions: 4050000, totalNet: 33150000, processedOn: '2024-02-27', approvedBy: 'Priya Patel' },
  { id: 'PR003', month: 'January 2024', status: 'completed', totalEmployees: 21, totalGross: 36100000, totalDeductions: 3950000, totalNet: 32150000, processedOn: '2024-01-29', approvedBy: 'Priya Patel' },
];

export const payrollTrend = [
  { month: 'Oct', gross: 32000000 },
  { month: 'Nov', gross: 33500000 },
  { month: 'Dec', gross: 33500000 },
  { month: 'Jan', gross: 36100000 },
  { month: 'Feb', gross: 37200000 },
  { month: 'Mar', gross: 38500000 },
];

export const ctcBreakdown = [
  { name: 'Basic Salary', value: 40, color: '#7C3AED' },
  { name: 'HRA', value: 20, color: '#06B6D4' },
  { name: 'Special Allowance', value: 25, color: '#10B981' },
  { name: 'PF (Employer)', value: 8, color: '#F59E0B' },
  { name: 'Gratuity', value: 4, color: '#EF4444' },
  { name: 'Other', value: 3, color: '#8B5CF6' },
];

// ============================================
// ATTENDANCE DATA
// ============================================

export const attendanceSummary = {
  presentToday: 19,
  absentToday: 2,
  onLeave: 2,
  lateArrivals: 3,
  avgWorkHours: '8h 24m',
  overtimeHours: 47,
};

export const generateAttendanceHeatmap = () => {
  const data = [];
  const statuses = ['present','present','present','present','present','weekend','weekend','absent','leave'];
  for (let i = 1; i <= 31; i++) {
    data.push({ day: i, status: statuses[Math.floor(Math.random() * statuses.length)] });
  }
  return data;
};

export const shiftSchedule = [
  { id: 'SH1', name: 'Morning', time: '9:00 AM – 6:00 PM', employees: 18, color: '#7C3AED' },
  { id: 'SH2', name: 'Evening', time: '2:00 PM – 11:00 PM', employees: 3, color: '#06B6D4' },
  { id: 'SH3', name: 'Remote', time: 'Flexible', employees: 2, color: '#10B981' },
];

// ============================================
// LEAVE DATA
// ============================================

export const leaveTypes = [
  { type: 'Casual Leave', code: 'CL', total: 12, used: 4, pending: 8, color: '#7C3AED' },
  { type: 'Sick Leave', code: 'SL', total: 10, used: 2, pending: 8, color: '#EF4444' },
  { type: 'Earned Leave', code: 'EL', total: 18, used: 7, pending: 11, color: '#10B981' },
  { type: 'Comp-Off', code: 'CO', total: 3, used: 1, pending: 2, color: '#F59E0B' },
];

export const leaveRequests = [
  { id: 'LR001', employee: 'E015', type: 'SL', from: '2024-03-25', to: '2024-03-26', days: 2, reason: 'Fever and cold', status: 'approved', appliedOn: '2024-03-24' },
  { id: 'LR002', employee: 'E016', type: 'EL', from: '2024-04-01', to: '2024-04-05', days: 5, reason: 'Family vacation', status: 'pending', appliedOn: '2024-03-20' },
  { id: 'LR003', employee: 'E019', type: 'CL', from: '2024-03-29', to: '2024-03-29', days: 1, reason: 'Personal work', status: 'pending', appliedOn: '2024-03-28' },
  { id: 'LR004', employee: 'E020', type: 'CL', from: '2024-03-22', to: '2024-03-22', days: 1, reason: 'Medical appointment', status: 'rejected', appliedOn: '2024-03-21' },
  { id: 'LR005', employee: 'E021', type: 'EL', from: '2024-04-10', to: '2024-04-12', days: 3, reason: 'Wedding anniversary trip', status: 'pending', appliedOn: '2024-03-28' },
  { id: 'LR006', employee: 'E017', type: 'SL', from: '2024-03-18', to: '2024-03-19', days: 2, reason: 'Not well', status: 'approved', appliedOn: '2024-03-17' },
];

export const holidays = [
  { date: '2024-01-26', name: 'Republic Day', type: 'national' },
  { date: '2024-03-25', name: 'Holi', type: 'national' },
  { date: '2024-04-14', name: 'Dr. Ambedkar Jayanti', type: 'national' },
  { date: '2024-05-01', name: 'Labour Day', type: 'national' },
  { date: '2024-08-15', name: 'Independence Day', type: 'national' },
  { date: '2024-10-02', name: 'Gandhi Jayanti', type: 'national' },
  { date: '2024-10-12', name: 'Dussehra', type: 'festival' },
  { date: '2024-11-01', name: 'Diwali', type: 'festival' },
  { date: '2024-12-25', name: 'Christmas', type: 'national' },
];

// ============================================
// PERFORMANCE DATA
// ============================================

export const performanceCycles = [
  { id: 'PC001', name: 'H1 2024 Review', period: 'Jan – Jun 2024', status: 'in_progress', completion: 45 },
  { id: 'PC002', name: 'H2 2023 Review', period: 'Jul – Dec 2023', status: 'completed', completion: 100 },
];

export const goals = [
  { id: 'G001', employee: 'E003', title: 'Launch Design System v2', category: 'OKR', target: 100, achieved: 75, dueDate: '2024-06-30', status: 'on_track' },
  { id: 'G002', employee: 'E003', title: 'Reduce page load time by 40%', category: 'KPI', target: 40, achieved: 28, dueDate: '2024-06-30', status: 'at_risk' },
  { id: 'G003', employee: 'E003', title: 'Complete 3 tech talks', category: 'Development', target: 3, achieved: 1, dueDate: '2024-06-30', status: 'on_track' },
  { id: 'G004', employee: 'E004', title: 'Achieve 95% customer satisfaction', category: 'KPI', target: 95, achieved: 91, dueDate: '2024-06-30', status: 'on_track' },
];

export const feedbackItems = [
  { id: 'F001', from: 'E001', to: 'E003', type: '360', rating: 4.5, comment: 'Excellent technical leadership. Always delivers quality work on time.', date: '2024-03-15' },
  { id: 'F002', from: 'E004', to: 'E003', type: 'peer', rating: 4, comment: 'Great collaboration on the product roadmap. Very responsive.', date: '2024-03-14' },
  { id: 'F003', from: 'E001', to: 'E007', type: '360', rating: 4.8, comment: 'Outstanding infrastructure work. The migration was flawless.', date: '2024-03-12' },
];

export const bellCurveData = [
  { rating: 'Exceptional (5)', count: 3, percent: 13 },
  { rating: 'Exceeds (4)', count: 7, percent: 30 },
  { rating: 'Meets (3)', count: 10, percent: 44 },
  { rating: 'Developing (2)', count: 2, percent: 9 },
  { rating: 'Below (1)', count: 1, percent: 4 },
];

// ============================================
// RECRUITMENT / ATS DATA
// ============================================

export const jobOpenings = [
  { id: 'JO001', title: 'Senior React Engineer', dept: 'Engineering', location: 'Bangalore', type: 'Full-time', openedOn: '2024-03-01', applicants: 47, status: 'active' },
  { id: 'JO002', title: 'Product Designer', dept: 'Design', location: 'Remote', type: 'Full-time', openedOn: '2024-03-10', applicants: 31, status: 'active' },
  { id: 'JO003', title: 'Sales Manager', dept: 'Sales', location: 'Delhi', type: 'Full-time', openedOn: '2024-02-15', applicants: 62, status: 'active' },
  { id: 'JO004', title: 'Data Scientist', dept: 'Operations', location: 'Hyderabad', type: 'Full-time', openedOn: '2024-03-20', applicants: 28, status: 'active' },
  { id: 'JO005', title: 'HR Generalist', dept: 'HR', location: 'Mumbai', type: 'Full-time', openedOn: '2024-02-20', applicants: 45, status: 'paused' },
];

export const candidates = [
  { id: 'C001', name: 'Aryan Kapoor', role: 'JO001', stage: 'offer', email: 'aryan@email.com', phone: '+91 98765 11111', score: 92, appliedOn: '2024-03-05', source: 'LinkedIn' },
  { id: 'C002', name: 'Simran Kaur', role: 'JO001', stage: 'interview', email: 'simran@email.com', phone: '+91 87654 22222', score: 88, appliedOn: '2024-03-07', source: 'Referral' },
  { id: 'C003', name: 'Dev Malhotra', role: 'JO001', stage: 'interview', email: 'dev@email.com', phone: '+91 76543 33333', score: 80, appliedOn: '2024-03-08', source: 'Naukri' },
  { id: 'C004', name: 'Riya Shah', role: 'JO002', stage: 'screening', email: 'riya@email.com', phone: '+91 65432 44444', score: 78, appliedOn: '2024-03-12', source: 'LinkedIn' },
  { id: 'C005', name: 'Kabir Anand', role: 'JO003', stage: 'applied', email: 'kabir@email.com', phone: '+91 54321 55555', score: 72, appliedOn: '2024-03-22', source: 'Direct' },
  { id: 'C006', name: 'Zara Hussain', role: 'JO002', stage: 'applied', email: 'zara@email.com', phone: '+91 43210 66666', score: 85, appliedOn: '2024-03-15', source: 'LinkedIn' },
  { id: 'C007', name: 'Vihaan Gupta', role: 'JO004', stage: 'screening', email: 'vihaan@email.com', phone: '+91 32109 77777', score: 90, appliedOn: '2024-03-21', source: 'Campus' },
  { id: 'C008', name: 'Nidhi Bose', role: 'JO001', stage: 'screening', email: 'nidhi@email.com', phone: '+91 21098 88888', score: 82, appliedOn: '2024-03-10', source: 'Referral' },
];

export const atsStages = [
  { id: 'applied', label: 'Applied', color: '#94A3B8' },
  { id: 'screening', label: 'Screening', color: '#F59E0B' },
  { id: 'interview', label: 'Interview', color: '#3B82F6' },
  { id: 'offer', label: 'Offer', color: '#10B981' },
  { id: 'hired', label: 'Hired', color: '#7C3AED' },
];

// ============================================
// ONBOARDING DATA
// ============================================

export const onboardingTasks = [
  { id: 'OT001', category: 'IT Setup', task: 'Laptop provisioned and configured', done: true },
  { id: 'OT002', category: 'IT Setup', task: 'Email account created', done: true },
  { id: 'OT003', category: 'IT Setup', task: 'Software licenses assigned', done: true },
  { id: 'OT004', category: 'HR', task: 'Offer letter signed', done: true },
  { id: 'OT005', category: 'HR', task: 'Background verification complete', done: true },
  { id: 'OT006', category: 'HR', task: 'Bank account details submitted', done: true },
  { id: 'OT007', category: 'HR', task: 'PF and ESI enrolled', done: false },
  { id: 'OT008', category: 'Induction', task: 'Company culture session', done: false },
  { id: 'OT009', category: 'Induction', task: 'Product demo walkthrough', done: false },
  { id: 'OT010', category: 'Induction', task: 'Buddy assigned and introduced', done: true },
  { id: 'OT011', category: 'Documents', task: 'ID proofs uploaded', done: true },
  { id: 'OT012', category: 'Documents', task: 'Educational certificates uploaded', done: false },
];

export const newJoiners = [
  { id: 'NJ001', name: 'Aryan Kapoor', role: 'Senior React Engineer', dept: 'Engineering', joiningDate: '2024-04-01', manager: 'E003', progress: 75, initials: 'AK' },
  { id: 'NJ002', name: 'Riya Shah', role: 'Product Designer', dept: 'Design', joiningDate: '2024-04-08', manager: 'E004', progress: 30, initials: 'RS' },
];

export const exitEmployees = [
  { id: 'EX001', employee: 'E023', reason: 'Better Opportunity', lastDay: '2024-03-31', noticePeriod: '60 days', assetsReturned: true, fnfStatus: 'in_progress', exitInterviewDone: true },
];

// ============================================
// ANALYTICS DATA
// ============================================

export const headcountTrend = [
  { month: 'Jan', headcount: 18 },
  { month: 'Feb', headcount: 19 },
  { month: 'Mar', headcount: 20 },
  { month: 'Apr', headcount: 20 },
  { month: 'May', headcount: 21 },
  { month: 'Jun', headcount: 21 },
  { month: 'Jul', headcount: 22 },
  { month: 'Aug', headcount: 22 },
  { month: 'Sep', headcount: 22 },
  { month: 'Oct', headcount: 23 },
  { month: 'Nov', headcount: 23 },
  { month: 'Dec', headcount: 23 },
];

export const attritionData = [
  { month: 'Jan', rate: 1.2 },
  { month: 'Feb', rate: 0 },
  { month: 'Mar', rate: 2.1 },
  { month: 'Apr', rate: 0 },
  { month: 'May', rate: 1.5 },
  { month: 'Jun', rate: 0 },
  { month: 'Jul', rate: 0.8 },
  { month: 'Aug', rate: 0 },
  { month: 'Sep', rate: 1.1 },
  { month: 'Oct', rate: 0 },
  { month: 'Nov', rate: 0.9 },
  { month: 'Dec', rate: 0 },
];

export const deptDistribution = [
  { dept: 'Engineering', count: 8, color: '#7C3AED' },
  { dept: 'Product', count: 2, color: '#06B6D4' },
  { dept: 'Design', count: 2, color: '#10B981' },
  { dept: 'Sales', count: 3, color: '#F59E0B' },
  { dept: 'HR', count: 3, color: '#EF4444' },
  { dept: 'Marketing', count: 2, color: '#8B5CF6' },
  { dept: 'Others', count: 3, color: '#94A3B8' },
];

export const genderDiversity = [
  { name: 'Male', value: 14, color: '#7C3AED' },
  { name: 'Female', value: 9, color: '#06B6D4' },
];

export const locationData = [
  { city: 'Bangalore', count: 9, lat: 12.97, lng: 77.59 },
  { city: 'Mumbai', count: 5, lat: 19.07, lng: 72.87 },
  { city: 'Delhi', count: 3, lat: 28.61, lng: 77.20 },
  { city: 'Hyderabad', count: 3, lat: 17.38, lng: 78.48 },
  { city: 'Pune', count: 2, lat: 18.52, lng: 73.85 },
  { city: 'Chennai', count: 2, lat: 13.08, lng: 80.27 },
  { city: 'Kochi', count: 2, lat: 9.93, lng: 76.26 },
];

export const activityFeed = [
  { id: 1, type: 'leave', text: 'Rohit Bansal applied for 5 days of Earned Leave', time: '10 minutes ago', icon: 'calendar' },
  { id: 2, type: 'hire', text: 'Aryan Kapoor accepted the offer for Senior React Engineer', time: '1 hour ago', icon: 'user-check' },
  { id: 3, type: 'payroll', text: 'March 2024 payroll processed successfully for 23 employees', time: '3 hours ago', icon: 'dollar-sign' },
  { id: 4, type: 'perf', text: 'Q2 2024 goal cycle kicked off by Priya Patel', time: '5 hours ago', icon: 'target' },
  { id: 5, type: 'employee', text: 'Meera Shah checked in 42 minutes late today', time: '8 hours ago', icon: 'clock' },
  { id: 6, type: 'hire', text: 'New job opening posted: Data Scientist – Hyderabad', time: '1 day ago', icon: 'briefcase' },
  { id: 7, type: 'employee', text: 'Asha Pillai offboarding initiated – last day March 31', time: '2 days ago', icon: 'log-out' },
];
