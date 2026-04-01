const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Finance Dashboard API",
      version: "1.0",
      description:
        "REST API documentation for the Finance Dashboard System with role-based access control."
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Local development server"
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      },
      schemas: {
        ErrorResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false
            },
            message: {
              type: "string",
              example: "Validation failed"
            }
          }
        },
        AuthRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              example: "alice@example.com"
            },
            password: {
              type: "string",
              example: "SecurePass123"
            }
          }
        },
        RegisterRequest: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            name: {
              type: "string",
              example: "Alice Doe"
            },
            email: {
              type: "string",
              example: "alice@example.com"
            },
            password: {
              type: "string",
              example: "SecurePass123"
            }
          }
        },
        User: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid"
            },
            name: {
              type: "string"
            },
            email: {
              type: "string"
            },
            role: {
              type: "string",
              enum: ["ADMIN", "ANALYST", "VIEWER"]
            },
            isActive: {
              type: "boolean"
            },
            createdAt: {
              type: "string",
              format: "date-time"
            }
          }
        },
        AuthResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true
            },
            message: {
              type: "string",
              example: "Login successful"
            },
            data: {
              type: "object",
              properties: {
                user: {
                  $ref: "#/components/schemas/User"
                },
                token: {
                  type: "string"
                }
              }
            }
          }
        },
        FinancialRecordRequest: {
          type: "object",
          required: ["amount", "type", "category", "date"],
          properties: {
            amount: {
              type: "number",
              example: 2500
            },
            type: {
              type: "string",
              enum: ["INCOME", "EXPENSE"]
            },
            category: {
              type: "string",
              example: "Salary"
            },
            date: {
              type: "string",
              format: "date-time"
            },
            notes: {
              type: "string",
              nullable: true
            }
          }
        },
        FinancialRecord: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid"
            },
            userId: {
              type: "string",
              format: "uuid"
            },
            amount: {
              type: "number"
            },
            type: {
              type: "string",
              enum: ["INCOME", "EXPENSE"]
            },
            category: {
              type: "string"
            },
            date: {
              type: "string",
              format: "date-time"
            },
            notes: {
              type: "string",
              nullable: true
            },
            isDeleted: {
              type: "boolean"
            },
            createdAt: {
              type: "string",
              format: "date-time"
            }
          }
        }
      }
    }
  },
  apis: ["./src/routes/*.js"]
};

module.exports = swaggerJsdoc(options);
