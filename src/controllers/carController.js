const { Car } = require('../models/Car');

const carController = {
    async create(req, res) {
        try {
            const { brand, model, year, price, mileage } = req.body;
            const userId = req.user.id;

            if (!brand || !model || !year || !price || !mileage) {
                return res.status(400).json({ error: 'All fields are required' });
            }

            const car = await Car.create(userId, brand, model, parseInt(year), parseInt(price), parseInt(mileage));
            
            res.status(201).json({
                message: 'Car created successfully',
                car
            });
        } catch (error) {
            console.error('Create car error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async getAll(req, res) {
        try {
            const cars = await Car.findAll();
            res.json(cars);
        } catch (error) {
            console.error('Get all cars error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async getByUserId(req, res) {
        try {
            const { userId } = req.params;
            const cars = await Car.findByUserId(parseInt(userId));
            res.json(cars);
        } catch (error) {
            console.error('Get user cars error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async update(req, res) {
        try {
            const { id } = req.params;
            const { price } = req.body;

            if (price === undefined || price === null || isNaN(parseInt(price))) {
                return res.status(400).json({ error: 'Price is required' });
            }

            const numericPrice = parseInt(price);
            const numericId = parseInt(id);
            const car = await Car.update(numericId, numericPrice);
            
            if (!car) {
                return res.status(404).json({ error: 'Car not found' });
            }

            res.json({
                message: 'Car updated successfully',
                car
            });
        } catch (error) {
            console.error('Update car error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async delete(req, res) {
        try {
            const { id } = req.params;
            if (!id || isNaN(parseInt(id))) {
                return res.status(400).json({ error: 'Valid car ID is required' });
            }
            const numericId = parseInt(id);
            const car = await Car.delete(numericId);
            
            if (!car) {
                return res.status(404).json({ error: 'Car not found' });
            }

            res.json({ message: 'Car deleted successfully' });
        } catch (error) {
            console.error('Delete car error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

module.exports = { carController };