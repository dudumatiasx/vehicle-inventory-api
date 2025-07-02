import express from 'express';
import dotenv from 'dotenv';
import { router as vehicles } from './routes/vehicles.js';

dotenv.config();
const app = express();
app.use(express.json());
app.use('/vehicles', vehicles);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`🚗 Vehicle API running on http://0.0.0.0:${port}`);
});
