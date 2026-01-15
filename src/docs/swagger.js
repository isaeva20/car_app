const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Car App API',
    version: '1.0.0',
    description: 'API для управления автомобилями и пользователями'
  },
  servers: [
    {
      url: 'http://localhost:3000/api',
      description: 'Development server'
    }
  ],
  tags: [
    {
      name: 'Auth',
      description: 'Аутентификация и регистрация пользователей'
    },
    {
      name: 'Cars',
      description: 'Управление автомобилями'
    },
    {
      name: 'Admin',
      description: 'Административные функции'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Введите JWT токен полученный при регистрации/входе'
      }
    },
    schemas: {
      User: {
        type: 'object',
        required: ['id', 'username', 'role'],
        properties: {
          id: {
            type: 'integer',
            example: 1
          },
          username: {
            type: 'string',
            example: 'john_doe'
          },
          role: {
            type: 'string',
            enum: ['user', 'admin'],
            example: 'user'
          }
        }
      },
      Car: {
        type: 'object',
        required: ['id', 'userId', 'brand', 'model', 'year', 'price', 'mileage'],
        properties: {
          id: {
            type: 'integer',
            example: 1
          },
          userId: {
            type: 'integer',
            example: 1
          },
          brand: {
            type: 'string',
            example: 'Toyota'
          },
          model: {
            type: 'string',
            example: 'Camry'
          },
          year: {
            type: 'integer',
            example: 2020
          },
          price: {
            type: 'integer',
            example: 2500000
          },
          mileage: {
            type: 'integer',
            example: 15000
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            example: '2024-01-15T10:30:00Z'
          }
        }
      },
      Error: {
        type: 'object',
        properties: {
          error: {
            type: 'string',
            example: 'Invalid credentials'
          }
        }
      },
      RegisterRequest: {
        type: 'object',
        required: ['username', 'password'],
        properties: {
          username: {
            type: 'string',
            example: 'john_doe',
            minLength: 3,
            maxLength: 50
          },
          password: {
            type: 'string',
            example: 'securePassword123',
            minLength: 6,
            format: 'password'
          }
        }
      },
      LoginRequest: {
        type: 'object',
        required: ['username', 'password'],
        properties: {
          username: {
            type: 'string',
            example: 'john_doe'
          },
          password: {
            type: 'string',
            example: 'securePassword123',
            format: 'password'
          }
        }
      },
      CarCreateRequest: {
        type: 'object',
        required: ['brand', 'model', 'year', 'price', 'mileage'],
        properties: {
          brand: {
            type: 'string',
            example: 'Toyota',
            maxLength: 50
          },
          model: {
            type: 'string',
            example: 'Camry',
            maxLength: 50
          },
          year: {
            type: 'integer',
            example: 2020,
            minimum: 1900,
            maximum: 2025
          },
          price: {
            type: 'integer',
            example: 2500000,
            minimum: 10000
          },
          mileage: {
            type: 'integer',
            example: 15000,
            minimum: 0
          }
        }
      },
      CarUpdateRequest: {
        type: 'object',
        required: ['price'],
        properties: {
          price: {
            type: 'integer',
            example: 2700000,
            minimum: 10000
          }
        }
      },
      AuthResponse: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'User registered successfully'
          },
          token: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
          },
          user: {
            $ref: '#/components/schemas/User'
          }
        }
      },
      CarResponse: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'Car created successfully'
          },
          car: {
            $ref: '#/components/schemas/Car'
          }
        }
      },
      MakeAdminResponse: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'User promoted to admin'
          },
          user: {
            $ref: '#/components/schemas/User'
          }
        }
      },
      DeleteResponse: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'Car deleted successfully'
          }
        }
      }
    }
  },
  security: [
    {
      bearerAuth: []
    }
  ]
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customSiteTitle: 'Car App API Documentation',
    customCss: '.swagger-ui .topbar { display: none }',
    swaggerOptions: {
      docExpansion: 'none',
      defaultModelsExpandDepth: -1,
      filter: true,
      showRequestDuration: true
    }
  }));
  
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
  
  console.log('Swagger документация доступна по адресу: http://localhost:3000/api-docs');
};