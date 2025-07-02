import express from 'express';
import dotenv from 'dotenv';
import { initDb } from './db.js';        // veja abaixo
import { router as vehicles } from './routes/vehicles.js';

dotenv.config();

// Auto-init
initDb().catch(err => {
  console.error('DB init failed', err);
  process.exit(1);
});

const app = express();
app.use(express.json());
app.use('/vehicles', vehicles);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`🚗 Vehicle API running on http://0.0.0.0:${port}`);
});
