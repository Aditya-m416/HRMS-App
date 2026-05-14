# NexusHR Backend

Express API backed by SQLite through Node's built-in `node:sqlite` module.

## Commands

```bash
npm --workspace backend run db:seed
npm --workspace backend run api
npm --workspace backend run api:watch
```

The API runs on `http://localhost:4000` by default. Set `API_PORT` or `PORT` to use a different port.

The SQLite database is created at `backend/data/nexushr.sqlite`. It is generated local state and is ignored by Git.

## MVC Layout

- `src/routes`: URL mappings only
- `src/controllers`: request validation and HTTP responses
- `src/models`: SQL queries and domain calculations
- `src/config`: database connection and migration helpers
- `src/database`: schema and seed script
- `src/utils`: shared serialization, date, and HTTP helpers

## Main Routes

- `GET /api/health`
- `GET /api/departments`
- `GET /api/employees`
- `GET /api/employees/:id`
- `POST /api/employees`
- `PATCH /api/employees/:id`
- `DELETE /api/employees/:id`
- `GET /api/payroll/runs`
- `POST /api/payroll/run`
- `GET /api/payroll/employees`
- `GET /api/payroll/payslips/:employeeId`
- `GET /api/leave/requests`
- `POST /api/leave/requests`
- `PATCH /api/leave/requests/:id`
- `POST /api/leave/requests/:id/approve`
- `POST /api/leave/requests/:id/reject`
- `GET /api/onboarding/tasks`
- `PATCH /api/onboarding/tasks/:id/toggle`
- `GET /api/recruitment/jobs`
- `GET /api/recruitment/candidates`
- `PATCH /api/recruitment/candidates/:id/stage`
- `GET /api/attendance/summary`
- `GET /api/attendance/heatmap`
- `GET /api/performance`
- `GET /api/analytics`

All responses use this shape:

```json
{ "data": {} }
```

Errors use this shape:

```json
{ "error": { "message": "..." } }
```
