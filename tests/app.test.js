const request = require('supertest');
const app = require('../src/index');
const { pool } = require('../src/config/db');

const TEST_USER = {
    username: 'testuser',
    password: 'testpassword123'
};

const TEST_CAR = {
    brand: 'Toyota',
    model: 'Camry',
    year: 2020,
    price: 25000,
    mileage: 15000
};

let userToken;
let adminToken;
let userId;
let carId;

describe('Car App API Tests', () => {
    beforeAll(async () => {
        try {
            await pool.query('TRUNCATE TABLE cars CASCADE');
            await pool.query('TRUNCATE TABLE users CASCADE');
        } catch (error) {
            console.error('Cleanup error', error);
        }
    });

    afterAll(async () => {
        await pool.end();
    });

    describe('Auth Endpoints', () => {
        test('POST /api/auth/register - should register a new user', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send(TEST_USER)
                .expect(201);

            expect(response.body).toHaveProperty('token');
            expect(response.body.user).toHaveProperty('id');
            expect(response.body.user.username).toBe(TEST_USER.username);
            expect(response.body.user.role).toBe('user');

            userId = response.body.user.id;
        });

        test('POST /api/auth/register - should not register user with existing username', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send(TEST_USER)
                .expect(400);

            expect(response.body).toHaveProperty('error');
        });

        test('POST /api/auth/login - should login user', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send(TEST_USER)
                .expect(200);

            expect(response.body).toHaveProperty('token');
            expect(response.body.user).toHaveProperty('id');
            expect(response.body.user.username).toBe(TEST_USER.username);

            userToken = response.body.token;
        });

        test('POST /api/auth/login - should not login with wrong password', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    username: TEST_USER.username,
                    password: 'wrongpassword'
                })
                .expect(400);

            expect(response.body).toHaveProperty('error');
        });

        test('GET /api/auth/me - should get current user info', async () => {
            const response = await request(app)
                .get('/api/auth/me')
                .set('Authorization', `Bearer ${userToken}`)
                .expect(200);

            expect(response.body).toHaveProperty('id');
            expect(response.body).toHaveProperty('username');
            expect(response.body).toHaveProperty('role');
            expect(response.body.username).toBe(TEST_USER.username);
        });

        test('GET /api/auth/me - should not work without token', async () => {
            const response = await request(app)
                .get('/api/auth/me')
                .expect(401);

            expect(response.body).toHaveProperty('error');
        });
    });

    describe('Car Endpoints', () => {
        test('POST /api/cars - should add a new car', async () => {
            const response = await request(app)
                .post('/api/cars')
                .set('Authorization', `Bearer ${userToken}`)
                .send(TEST_CAR)
                .expect(201);
            
            expect(response.body).toHaveProperty('car');
            expect(response.body.car).toHaveProperty('id');
            expect(response.body.car.brand).toBe(TEST_CAR.brand);
            expect(response.body.car.model).toBe(TEST_CAR.model);
            expect(response.body.car.userid).toBe(userId);

            carId = response.body.car.id;
        });

        test('POST /api/cars - should not add car without authentication', async () => {
            const response = await request(app)
                .post('/api/cars')
                .send(TEST_CAR)
                .expect(401);

            expect(response.body).toHaveProperty('error');
        });

        test('GET /api/cars/list - should get all cars', async () => {
            const response = await request(app)
                .get('/api/cars/list')
                .set('Authorization', `Bearer ${userToken}`)
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
            expect(response.body[0]).toHaveProperty('id');
            expect(response.body[0]).toHaveProperty('brand');
        });

        test('GET /api/cars/:userId - should get user cars', async () => {
            const response = await request(app)
                .get(`/api/cars/${userId}`)
                .set('Authorization', `Bearer ${userToken}`)
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
            if (response.body.length > 0) {
                expect(response.body[0]).toHaveProperty('userid');
            }
        });

        test('PUT /api/cars/:id - should update car price', async () => {
            const newPrice = 27000;
            const response = await request(app)
                .put(`/api/cars/${carId}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({ price: newPrice })
                .expect(200);

            expect(response.body).toHaveProperty('message');
            expect(response.body.car.price).toBe(newPrice);
        });

        test('PUT /api/cars/:id - should not update non-existent car', async () => {
            const response = await request(app)
                .put('/api/cars/99999')
                .set('Authorization', `Bearer ${userToken}`)
                .send({ price: 30000 })
                .expect(404);

            expect(response.body).toHaveProperty('error');
        });

        test('DELETE /api/cars/:id - should delete car', async () => {
            const response = await request(app)
                .delete(`/api/cars/${carId}`)
                .set('Authorization', `Bearer ${userToken}`)
                .expect(200);

            expect(response.body).toHaveProperty('message');
        });

        test('DELETE /api/cars/:id - should not delete non-existent car', async () => {
            const response = await request(app)
                .delete('/api/cars/99999')
                .set('Authorization', `Bearer ${userToken}`)
                .expect(404);

            expect(response.body).toHaveProperty('error');
        });
    });

    describe('Admin Endpoints', () => {
        let adminId;
        let secondUserId;
        beforeAll(async () => {
            try {
                const timestamp = Date.now();
                const adminUsername = `testadmin_${timestamp}`;
                const secondUsername = `seconduser_${timestamp}`;

                console.log('Creating admin with username:', adminUsername);
                console.log('Creating second user with username:', secondUsername);
                
                const adminResponse = await request(app)
                    .post('/api/auth/register')
                    .send({
                        username: adminUsername,
                        password: 'adminpassword123'
                    });
                console.log('Admin response:', adminResponse.body);

                if (!adminResponse.body.user) {
                    throw new Error('Failed to create admin user');
                }

                adminId = adminResponse.body.user.id;

                await pool.query(
                    'UPDATE users SET role = $1 WHERE id = $2',
                    ['admin', adminId]
                );

                const loginResponse = await request(app)
                    .post('/api/auth/login')
                    .send({
                        username: adminUsername,
                        password: 'adminpassword123'
                    });

                adminToken = loginResponse.body.token;

                const secondUser = await request(app)
                    .post('/api/auth/register')
                    .send({
                        username: 'secondUsername',
                        password: 'password123'
                    });

                console.log('Second user response:', secondUser.body);

                if (secondUser.body && secondUser.body.user) {
                    secondUserId = secondUser.body.user.id;
                } else {
                    throw new Error('Failed to create second user: ' + JSON.stringify(secondUser.body));
                }
            } catch (error) {
                console.error('Admin setup error:', error);
                throw error;
            }
        });

        test('GET /api/admin/users - should get all users (admin only)', async () => {
            const response = await request(app)
                .get('/api/admin/users')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(1);
            expect(response.body[0]).toHaveProperty('id');
            expect(response.body[0]).toHaveProperty('username');
            expect(response.body[0]).toHaveProperty('role');
        });

        test('GET /api/admin/users - should not work for non-admin', async () => {
            const response = await request(app)
                .get('/api/admin/users')
                .set('Authorization', `Bearer ${userToken}`)
                .expect(403);

            expect(response.body).toHaveProperty('error');
        });

        test('PATCH /api/admin/users/:id/make-admin - should make user admin', async () => {
            const response = await request(app)
                .patch(`/api/admin/users/${secondUserId}/make-admin`)
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);

            expect(response.body).toHaveProperty('message');
            expect(response.body.user.role).toBe('admin');
        });

        test('PATCH /api/admin/users/:id/make-admin - should not work for non-admin', async () => {
            const response = await request(app)
                .patch(`/api/admin/users/${secondUserId}/make-admin`)
                .set('Authorization', `Bearer ${userToken}`)
                .expect(403);

            expect(response.body).toHaveProperty('error');
        });

        test('DELETE /api/admin/users/:id - should delete user (admin only)', async () => {
            const tempUsername = `tobedeleted_${Date.now()}`;
            const tempUser = await request(app)
                .post('/api/auth/register')
                .send({
                    username: tempUsername,
                    password: 'password123'
                });

            const response = await request(app)
                .delete(`/api/admin/users/${tempUser.body.user.id}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);

            expect(response.body).toHaveProperty('message');
        });

        test('DELETE /api/admin/users/:id - should not allow self-deletion', async () => {
            const response = await request(app)
                .delete(`/api/admin/users/${adminId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(400);

            expect(response.body).toHaveProperty('error');
        });

        test('DELETE /api/admin/users/:id - should not work for non-admin', async () => {
            const response = await request(app)
                .delete(`/api/admin/users/${secondUserId}`)
                .set('Authorization', `Bearer ${userToken}`)
                .expect(403);

            expect(response.body).toHaveProperty('error');
        });
    });
});