const pg = require('pg');
const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const checkConnection = async () => {
    try {
        await pool.query('SELECT 1');
        console.log('PostgreSQL connected successfully');
    } catch (error) {
        console.error('Database connection failed:', error.message);
        process.exit(1);
    }
};

module.exports = { pool, checkConnection };