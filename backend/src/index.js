import 'dotenv/config';
import app from './app.js';
import { dbPath } from './config/database.js';

const port = Number(process.env.API_PORT || process.env.PORT || 4000);

const server = app.listen(port, () => {
  console.log(`NexusHR API running at http://localhost:${port}`);
  console.log(`SQLite database: ${dbPath}`);
});

process.on('SIGTERM', () => server.close(() => process.exit(0)));
process.on('SIGINT', () => server.close(() => process.exit(0)));
