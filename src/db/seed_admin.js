// Run this script once to create the admin user in the database
const bcrypt = require('bcrypt');
const pool = require('../db');

async function seedAdmin() {
  const username = 'admin';
  const password = 'P4ssword';
  const hash = await bcrypt.hash(password, 10);
  try {
    await pool.query('INSERT INTO admin (username, password) VALUES (?, ?)', [username, hash]);
    console.log('Admin user created');
    process.exit(0);
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      console.log('Admin user already exists');
    } else {
      console.error(err);
    }
    process.exit(1);
  }
}

seedAdmin();
