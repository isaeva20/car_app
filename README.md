Car App - Веб-приложение для управления автомобилями

**Цели и задачи**:

Создать систему управления автомобилями с пользовательской аутентификацией
Реализовать CRUD операции для автомобилей
Добавить административные функции для управления пользователями
Обеспечить безопасность данных с использованием JWT токенов

**Основные функции**:

Регистрация и аутентификация пользователей
Добавление, просмотр, обновление и удаление автомобилей
Административная панель для управления пользователями
Просмотр всех автомобилей и автомобилей конкретного пользователя
Обновление цен на автомобили
Ролевая система (user/admin)

**Используемые инструменты и технологии**:

Backend:
Node.js - серверная платформа
Express.js - веб-фреймворк
PostgreSQL - реляционная база данных
JWT (JSON Web Tokens) - аутентификация
bcrypt - хеширование паролей

Frontend:
HTML5 - структура страниц
CSS3/Bootstrap 5 - стилизация

Разработка и тестирование:
Jest - фреймворк для тестирования
Supertest - тестирование HTTP запросов
Swagger - API документация
dotenv - управление переменными окружения

**Описание базы данных**

Таблица users:
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
Таблица cars:
```sql
CREATE TABLE cars (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    brand VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    year INTEGER NOT NULL CHECK (year >= 1900),
    price INTEGER NOT NULL CHECK (price >= 10000),
    mileage INTEGER NOT NULL CHECK (mileage >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
Связи:
Один пользователь (users) может иметь много автомобилей (cars)
При удалении пользователя удаляются все его автомобили (CASCADE)

**Установка и запуск приложения**

1. Клонирование репозитория: git clone https://github.com/isaeva20/car_app.git; cd car_app
2. Установка зависимостей: npm install
3. Настройка базы данных: создание базы данных car_app; выполнение команд из описания бд
4. Настройка переменных окружения: cоздание .env файла в корне проекта
5. Запуск приложения: npm start

Запуск тестов
npm test

**API Документация**

http://localhost:3000/api_docs
