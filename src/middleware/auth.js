const basicAuth = require('basic-auth');
const pool = require('../db');
const bcrypt = require('bcrypt');

module.exports = async function (req, res, next) {
  const user = basicAuth(req);
  if (!user || !user.name || !user.pass) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  try {
    const [rows] = await pool.query('SELECT * FROM admin WHERE username = ?', [user.name]);
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const valid = await bcrypt.compare(user.pass, rows[0].password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    next();
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
