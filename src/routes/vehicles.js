import { Router } from 'express';
import { pool } from '../db.js';

export const router = Router();

// List all vehicles
router.get('/', async (_, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM vehicles ORDER BY id');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    res.status(500).json({ error: 'Unable to fetch vehicles' });
  }
});

// Create a new vehicle
router.post('/', async (req, res) => {
  const { plate, model, year, mileage } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO vehicles (plate, model, year, mileage)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [plate, model, year, mileage || 0]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error creating vehicle:', error);
    res.status(500).json({ error: 'Unable to create vehicle' });
  }
});

// Read a single vehicle
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query(
      'SELECT * FROM vehicles WHERE id = $1',
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching vehicle:', error);
    res.status(500).json({ error: 'Unable to fetch vehicle' });
  }
});

// Update a vehicle
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { plate, model, year, mileage } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE vehicles
       SET plate = $1, model = $2, year = $3, mileage = $4
       WHERE id = $5
       RETURNING *`,
      [plate, model, year, mileage, id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error updating vehicle:', error);
    res.status(500).json({ error: 'Unable to update vehicle' });
  }
});

// Delete a vehicle
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM vehicles WHERE id = $1',
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    res.status(500).json({ error: 'Unable to delete vehicle' });
  }
});
