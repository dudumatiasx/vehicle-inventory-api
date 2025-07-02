import { Router } from 'express';
import { pool } from '../db.js';

export const router = Router();

// Initialize table
router.post('/init', async (_, res) => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS vehicles (
      id SERIAL PRIMARY KEY,
      plate VARCHAR(10) UNIQUE NOT NULL,
      model VARCHAR(50) NOT NULL,
      year INTEGER NOT NULL,
      mileage INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
  res.send({ ok: true });
});

// CRUD: list
router.get('/', async (_, res) => {
  const { rows } = await pool.query('SELECT * FROM vehicles ORDER BY id');
  res.json(rows);
});

// create
router.post('/', async (req, res) => {
  const { plate, model, year, mileage } = req.body;
  const { rows } = await pool.query(
    `INSERT INTO vehicles(plate, model, year, mileage)
     VALUES($1,$2,$3,$4) RETURNING *`,
    [plate, model, year, mileage || 0]
  );
  res.status(201).json(rows[0]);
});

// read single
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const { rows } = await pool.query('SELECT * FROM vehicles WHERE id=$1', [id]);
  res.json(rows[0] || null);
});

// update
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { plate, model, year, mileage } = req.body;
  const { rows } = await pool.query(
    `UPDATE vehicles SET plate=$1,model=$2,year=$3,mileage=$4
     WHERE id=$5 RETURNING *`,
    [plate, model, year, mileage, id]
  );
  res.json(rows[0] || null);
});

// delete
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM vehicles WHERE id=$1', [id]);
  res.status(204).end();
});
