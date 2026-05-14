# NexusHR

NexusHR is split into two applications:

- `frontend/`: Vite + React HRMS UI
- `backend/`: Express + Node.js API using SQL via SQLite

## Commands

Run from the repository root:

```bash
npm install
npm run dev
npm run api
npm run db:seed
npm run build
```

## Backend MVC Structure

- `backend/src/routes`: route definitions
- `backend/src/controllers`: HTTP request/response handlers
- `backend/src/models`: SQL queries and domain logic
- `backend/src/config`: database configuration
- `backend/src/database`: schema and seed script
- `backend/src/utils`: shared helpers
