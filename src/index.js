require('dotenv').config();
const express = require('express');
const path = require('path');
const { checkConnection } = require('./config/db');

const authRoutes = require('./routes/auth');
const carRoutes = require('./routes/cars');
const adminRoutes = require('./routes/admin');

const setupSwagger = require('./docs/swagger')

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

checkConnection()
    .then(() => {
        console.log('Database connected successfully');
    })
    .catch(error => {
        console.error('Database connection failed:', error);
        process.exit(1);
    });

setupSwagger(app);

app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
    res.redirect('/register');
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/register.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/login.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/dashboard.html'));
});

app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;