const { pool } = require('../config/db');

const Admin = {
    async makeAdmin(userId) {
        const result = await pool.query(
            'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, username, role',
            ['admin', userId]
        );
        return result.rows[0];
    },

    async getAllUsers() {
        const result = await pool.query(
            'SELECT id, username, role FROM users ORDER BY id'
        );
        return result.rows;
    },

    async deleteUser(userId) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            await client.query('DELETE FROM cars WHERE userId = $1', [userId]);
            const result = await client.query('DELETE FROM users WHERE id = $1 RETURNING *', [userId]);
            await client.query('COMMIT');
            return result.rows[0];
        } catch(error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
        
    }
};

module.exports = { Admin };