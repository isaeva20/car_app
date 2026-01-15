const { pool } = require('../config/db');

const Car = {
    async create(userId, brand, model, year, price, mileage) {
        const result = await pool.query(
            'INSERT INTO cars (userId, brand, model, year, price, mileage) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [userId, brand, model, year, price, mileage]
        );
        return result.rows[0];
    },

    async findAll() {
        const result = await pool.query('SELECT * FROM cars ORDER BY id');
        return result.rows;
    },

    async findByUserId(userId) {
        const result = await pool.query(
            'SELECT * FROM cars WHERE userId = $1 ORDER BY id',
            [userId]
        );
        return result.rows;
    },

    async update(id, price) {
       const result = await pool.query(
            'UPDATE cars SET price = $1 WHERE id = $2 RETURNING *',
            [price, id]
        );
        return result.rows[0];
    },

    async delete(id) {
        const result = await pool.query('DELETE FROM cars WHERE id = $1 RETURNING *', [id]);
        return result.rows[0];
    }
};

module.exports = { Car };