const express = require('express');
const { adminController } = require('../controllers/adminController');
const { requireAdmin, checkAuth } = require('../middlewares/auth');

const router = express.Router();
router.use(checkAuth);
router.use(requireAdmin);

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Получение всех пользователей
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Успешное получение информации о пользователях
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Неавторизованный доступ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Доступ запрещен
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Внутренняя ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/users', adminController.getAllUsers);

/**
 * @swagger
 * /admin/users/{id}/make-admin:
 *   patch:
 *     summary: Назначение пользователя администратором
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           example: 2
 *     responses:
 *       200:
 *        description: Пользователь успешно назначен администратором
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/MakeAdminResponse'
 *       400:
 *        description: Ошибка валидации
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Error'
 *       401:
 *         description: Неавторизованный доступ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Доступ запрещен (не админ)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Пользователь не найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Внутренняя ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.patch('/users/:id/make-admin', adminController.makeAdmin);

/**
 * @swagger
 * /admin/users/{id}:
 *   delete:
 *     summary: Удаление пользователя
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           example: 2
 *     responses:
 *       200:
 *         description: Пользователь успешно удален
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeleteResponse'
 *       400:
 *         description: Ошибка валидации
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Неавторизованный доступ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Доступ запрещен
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Пользователь не найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Внутренняя ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/users/:id', adminController.deleteUser);

module.exports = router;