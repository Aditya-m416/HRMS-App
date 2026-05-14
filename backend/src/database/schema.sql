PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS employees (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  dept TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  location TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  join_date TEXT,
  salary INTEGER NOT NULL DEFAULT 0,
  manager TEXT,
  reportees TEXT NOT NULL DEFAULT '[]',
  avatar TEXT,
  initials TEXT,
  skills TEXT NOT NULL DEFAULT '[]',
  level TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (manager) REFERENCES employees(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS payroll_runs (
  id TEXT PRIMARY KEY,
  month TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'completed',
  total_employees INTEGER NOT NULL,
  total_gross INTEGER NOT NULL,
  total_deductions INTEGER NOT NULL,
  total_net INTEGER NOT NULL,
  processed_on TEXT NOT NULL,
  approved_by TEXT
);

CREATE TABLE IF NOT EXISTS leave_requests (
  id TEXT PRIMARY KEY,
  employee TEXT NOT NULL,
  type TEXT NOT NULL,
  from_date TEXT NOT NULL,
  to_date TEXT NOT NULL,
  days INTEGER NOT NULL,
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  applied_on TEXT NOT NULL,
  decided_on TEXT,
  FOREIGN KEY (employee) REFERENCES employees(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS onboarding_tasks (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  task TEXT NOT NULL,
  done INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS job_openings (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  dept TEXT NOT NULL,
  location TEXT,
  type TEXT,
  opened_on TEXT,
  applicants INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active'
);

CREATE TABLE IF NOT EXISTS candidates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  stage TEXT NOT NULL DEFAULT 'applied',
  email TEXT,
  phone TEXT,
  score INTEGER NOT NULL DEFAULT 0,
  applied_on TEXT,
  source TEXT,
  FOREIGN KEY (role) REFERENCES job_openings(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS attendance_checkins (
  employee_id TEXT PRIMARY KEY,
  checked_in INTEGER NOT NULL DEFAULT 0,
  checked_in_at TEXT,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS reference_data (
  key TEXT PRIMARY KEY,
  payload TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'employee',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_employees_dept ON employees(dept);
CREATE INDEX IF NOT EXISTS idx_employees_status ON employees(status);
CREATE INDEX IF NOT EXISTS idx_leave_status ON leave_requests(status);
CREATE INDEX IF NOT EXISTS idx_candidates_stage ON candidates(stage);
