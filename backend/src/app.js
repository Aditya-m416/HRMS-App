import cors from 'cors';
import express from 'express';
import { migrate } from './config/database.js';
import { root } from './controllers/systemController.js';
import { seed } from './database/seed.js';
import apiRoutes from './routes/index.js';
import { fail } from './utils/http.js';

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || true }));
app.use(express.json({ limit: '1mb' }));

migrate();
seed();

app.get('/', root);
app.use('/api', apiRoutes);

app.use((req, res) => fail(res, 404, 'Route not found'));

app.use((err, req, res, next) => {
  console.error(err);
  fail(res, 500, 'Internal server error', process.env.NODE_ENV === 'production' ? undefined : err.message);
});

export default app;
