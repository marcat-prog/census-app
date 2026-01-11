const express = require('express');
const pool = require('../db');
const validator = require('validator');

const router = express.Router();

// Helper: Validate participant JSON
function validateParticipant(body) {
  const { email, firstname, lastname, dob, work, home } = body;
  if (!email || !validator.isEmail(email)) return 'Invalid or missing email';
  if (!firstname) return 'Missing firstname';
  if (!lastname) return 'Missing lastname';
  if (!dob || !/^\d{4}-\d{2}-\d{2}$/.test(dob)) return 'Invalid or missing dob (YYYY-MM-DD)';
  if (!work || typeof work !== 'object') return 'Missing work details';
  if (!work.companyname) return 'Missing companyname';
  if (typeof work.salary !== 'number') return 'Missing or invalid salary';
  if (!work.currency) return 'Missing currency';
  if (!home || typeof home !== 'object') return 'Missing home details';
  if (!home.country) return 'Missing country';
  if (!home.city) return 'Missing city';
  return null;
}

// POST /participants/add
router.post('/add', async (req, res) => {
  const error = validateParticipant(req.body);
  if (error) return res.status(400).json({ error });
  const { email, firstname, lastname, dob, work, home } = req.body;
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query('INSERT INTO participants (email, firstname, lastname, dob) VALUES (?, ?, ?, ?)', [email, firstname, lastname, dob]);
    await conn.query('INSERT INTO work (participant_email, companyname, salary, currency) VALUES (?, ?, ?, ?)', [email, work.companyname, work.salary, work.currency]);
    await conn.query('INSERT INTO home (participant_email, country, city) VALUES (?, ?, ?)', [email, home.country, home.city]);
    await conn.commit();
    res.json({ message: 'Participant added' });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ error: 'Failed to add participant', details: err.message });
  } finally {
    conn.release();
  }
});

// GET /participants
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM participants');
    res.json({ participants: rows });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch participants' });
  }
});

// GET /participants/details
router.get('/details', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT firstname, lastname, email FROM participants');
    res.json({ details: rows });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch details' });
  }
});

// GET /participants/details/:email
router.get('/details/:email', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT firstname, lastname, dob FROM participants WHERE email = ?', [req.params.email]);
    if (rows.length === 0) return res.status(404).json({ error: 'Participant not found' });
    res.json({ details: rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch participant details' });
  }
});

// GET /participants/work/:email
router.get('/work/:email', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT companyname, salary, currency FROM work WHERE participant_email = ?', [req.params.email]);
    if (rows.length === 0) return res.status(404).json({ error: 'Work details not found' });
    res.json({ work: rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch work details' });
  }
});

// GET /participants/home/:email
router.get('/home/:email', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT country, city FROM home WHERE participant_email = ?', [req.params.email]);
    if (rows.length === 0) return res.status(404).json({ error: 'Home details not found' });
    res.json({ home: rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch home details' });
  }
});

// DELETE /participants/:email
router.delete('/:email', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM participants WHERE email = ?', [req.params.email]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Participant not found' });
    res.json({ message: 'Participant deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete participant' });
  }
});

// PUT /participants/:email
router.put('/:email', async (req, res) => {
  const error = validateParticipant(req.body);
  if (error) return res.status(400).json({ error });
  const { email, firstname, lastname, dob, work, home } = req.body;
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [result] = await conn.query('UPDATE participants SET firstname=?, lastname=?, dob=? WHERE email=?', [firstname, lastname, dob, req.params.email]);
    if (result.affectedRows === 0) {
      await conn.rollback();
      return res.status(404).json({ error: 'Participant not found' });
    }
    await conn.query('UPDATE work SET companyname=?, salary=?, currency=? WHERE participant_email=?', [work.companyname, work.salary, work.currency, req.params.email]);
    await conn.query('UPDATE home SET country=?, city=? WHERE participant_email=?', [home.country, home.city, req.params.email]);
    await conn.commit();
    res.json({ message: 'Participant updated' });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ error: 'Failed to update participant', details: err.message });
  } finally {
    conn.release();
  }
});

module.exports = router;
