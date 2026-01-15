const jwt = require('jsonwebtoken');
const { User } = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET;

const authController = {
    async register(req, res) {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                return res.status(400).json({ error: 'Username and password are required' });
            }

            if (await User.usernameExists(username)) {
                return res.status(400).json({ error: 'Username already exists' });
            }

            const user = await User.create(username, password);

            const token = jwt.sign(
                { id: user.id, username: user.username, role: user.role },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.status(201).json({
                message: 'User registered successfully',
                token,
                user: { id: user.id, username: user.username, role: user.role }
            });
        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async login(req, res) {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                return res.status(400).json({ error: 'Username and password are required' });
            }

            const user = await User.findByUsername(username);
            if (!user) {
                return res.status(400).json({ error: 'Invalid credentials' });
            }

            const isValidPassword = await User.verifyPassword(password, user.password);
            if (!isValidPassword) {
                return res.status(400).json({ error: 'Invalid credentials' });
            }

            const token = jwt.sign(
                { id: user.id, username: user.username, role: user.role },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({
                message: 'Login successful',
                token,
                user: { id: user.id, username: user.username, role: user.role }
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async getMe(req, res) {
        try {
            const user = await User.findById(req.user.id);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json(user);
        } catch (error) {
            console.error('Get me error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

module.exports = { authController };