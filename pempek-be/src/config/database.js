const { Pool } = require('pg');
require('dotenv').config();

// Create PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Error connecting to PostgreSQL database:', err.message);
    return;
  }
  console.log('✅ PostgreSQL Database (Supabase) connected successfully!');
  release();
});

// Helper function untuk compatibility dengan MySQL syntax
// MySQL pakai [rows] = await db.query(), PostgreSQL pakai .rows
pool.query = async function(text, params) {
  const result = await this.query(text, params);
  // Return format [rows] seperti MySQL untuk compatibility
  return [result.rows, result];
};

module.exports = pool;