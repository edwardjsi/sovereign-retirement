const Pool = require('pg').Pool;

const pool = new Pool({
  user: 'postgres',
  password: 'admin123', // 👈 MAKE SURE THIS IS YOUR ACTUAL PASSWORD
  host: 'localhost',
  port: 5432,
  database: 'sovereign_db'
});

module.exports = pool;