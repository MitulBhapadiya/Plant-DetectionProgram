
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5500;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', // default XAMPP password is empty
  database: 'farm_assistant',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection
app.get('/api/test', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 as connected');
    res.json({ message: 'Database connected successfully', data: rows });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ message: 'Database connection failed', error: error.message });
  }
});

// CROP ENDPOINTS
// Get all crops
app.get('/api/crops', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM crops');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching crops:', error);
    res.status(500).json({ message: 'Error fetching crops', error: error.message });
  }
});

// Get crop by ID
app.get('/api/crops/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM crops WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Crop not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching crop:', error);
    res.status(500).json({ message: 'Error fetching crop', error: error.message });
  }
});

// Add new crop
app.post('/api/crops', async (req, res) => {
  try {
    const { name, category, season, waterRequirement, soilType, description, plantingInfo, careInfo, harvestingInfo } = req.body;
    const [result] = await pool.query(
      'INSERT INTO crops (name, category, season, waterRequirement, soilType, description, plantingInfo, careInfo, harvestingInfo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, category, season, waterRequirement, soilType, description, plantingInfo, careInfo, harvestingInfo]
    );
    const newCrop = { id: result.insertId, ...req.body };
    res.status(201).json(newCrop);
  } catch (error) {
    console.error('Error adding crop:', error);
    res.status(500).json({ message: 'Error adding crop', error: error.message });
  }
});

// Update crop
app.put('/api/crops/:id', async (req, res) => {
  try {
    const { name, category, season, waterRequirement, soilType, description, plantingInfo, careInfo, harvestingInfo } = req.body;
    const [result] = await pool.query(
      'UPDATE crops SET name = ?, category = ?, season = ?, waterRequirement = ?, soilType = ?, description = ?, plantingInfo = ?, careInfo = ?, harvestingInfo = ? WHERE id = ?',
      [name, category, season, waterRequirement, soilType, description, plantingInfo, careInfo, harvestingInfo, req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Crop not found' });
    }
    
    const updatedCrop = { id: parseInt(req.params.id), ...req.body };
    res.json(updatedCrop);
  } catch (error) {
    console.error('Error updating crop:', error);
    res.status(500).json({ message: 'Error updating crop', error: error.message });
  }
});

// Delete crop
app.delete('/api/crops/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM crops WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Crop not found' });
    }
    
    res.json({ message: 'Crop deleted successfully' });
  } catch (error) {
    console.error('Error deleting crop:', error);
    res.status(500).json({ message: 'Error deleting crop', error: error.message });
  }
});

// DISEASE SOLUTION ENDPOINTS
// Get all solutions
app.get('/api/solutions', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM solutions');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching solutions:', error);
    res.status(500).json({ message: 'Error fetching solutions', error: error.message });
  }
});

// Get solution by ID
app.get('/api/solutions/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM solutions WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Solution not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching solution:', error);
    res.status(500).json({ message: 'Error fetching solution', error: error.message });
  }
});

// Get solution by disease name
app.get('/api/solutions/disease/:name', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM solutions WHERE disease LIKE ?', [`%${req.params.name}%`]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Solution not found for this disease' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching solution by disease:', error);
    res.status(500).json({ message: 'Error fetching solution', error: error.message });
  }
});

// Add new solution
app.post('/api/solutions', async (req, res) => {
  try {
    const { disease, organicSolution, chemicalSolution } = req.body;
    const [result] = await pool.query(
      'INSERT INTO solutions (disease, organicSolution, chemicalSolution) VALUES (?, ?, ?)',
      [disease, organicSolution, chemicalSolution]
    );
    const newSolution = { id: result.insertId, ...req.body };
    res.status(201).json(newSolution);
  } catch (error) {
    console.error('Error adding solution:', error);
    res.status(500).json({ message: 'Error adding solution', error: error.message });
  }
});

// Update solution
app.put('/api/solutions/:id', async (req, res) => {
  try {
    const { disease, organicSolution, chemicalSolution } = req.body;
    const [result] = await pool.query(
      'UPDATE solutions SET disease = ?, organicSolution = ?, chemicalSolution = ? WHERE id = ?',
      [disease, organicSolution, chemicalSolution, req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Solution not found' });
    }
    
    const updatedSolution = { id: parseInt(req.params.id), ...req.body };
    res.json(updatedSolution);
  } catch (error) {
    console.error('Error updating solution:', error);
    res.status(500).json({ message: 'Error updating solution', error: error.message });
  }
});

// Delete solution
app.delete('/api/solutions/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM solutions WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Solution not found' });
    }
    
    res.json({ message: 'Solution deleted successfully' });
  } catch (error) {
    console.error('Error deleting solution:', error);
    res.status(500).json({ message: 'Error deleting solution', error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
