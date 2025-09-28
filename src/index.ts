import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { cors } from '@elysiajs/cors';
import { connectDB, closeDB } from './config/mongoose';
import { userRoutes } from './routes/user.routes';
import dotenv from 'dotenv';

// Only load .env in development
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const app = new Elysia()
  // Add CORS
  .use(cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }))
  // Add Swagger documentation
  .use(
    swagger({
      path: '/swagger',
      documentation: {
        info: {
          title: 'User CRUD API',
          version: '1.0.0',
          description: 'ElysiaJS User CRUD API with MongoDB Atlas',
          contact: {
            name: 'API Support',
            email: 'support@example.com'
          }
        },
        tags: [
          {
            name: 'Users',
            description: 'User management endpoints'
          },
          {
            name: 'Health',
            description: 'Health check endpoints'
          }
        ],
        servers: [
          {
            url: process.env.RAILWAY_PUBLIC_DOMAIN 
              ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`
              : `http://localhost:${process.env.PORT || 3000}`,
            description: process.env.RAILWAY_PUBLIC_DOMAIN ? 'Production server' : 'Development server'
          }
        ]
      },
      swaggerOptions: {
        persistAuthorization: true,
        tryItOutEnabled: true
      },
      exclude: []
    })
  )
  // Health check endpoint
  .get('/', () => ({
    success: true,
    message: 'User CRUD API is running!',
    version: '1.0.0',
    documentation: '/swagger',
    timestamp: new Date().toISOString()
  }), {
    detail: {
      summary: 'API Health Check',
      tags: ['Health'],
      description: 'Check if the API is running'
    }
  })
  // Health check with database status
  .get('/health', async () => {
    try {
      await connectDB();
      // Check if mongoose is connected
      const mongoose = (await import('mongoose')).default;
      const isConnected = mongoose.connection.readyState === 1;
      
      return {
        success: isConnected,
        message: isConnected ? 'API and database are healthy' : 'Database not connected',
        status: {
          api: 'healthy',
          database: isConnected ? 'connected' : 'disconnected'
        },
        timestamp: new Date().toISOString()
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Database connection failed',
        status: {
          api: 'healthy',
          database: 'disconnected'
        },
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }, {
    detail: {
      summary: 'Detailed Health Check',
      tags: ['Health'],
      description: 'Check API and database health status'
    }
  })
  // Add user routes
  .use(userRoutes)
  // Global error handler
  .onError(({ code, error, set }) => {
    console.error(`Error ${code}:`, error);
    
    if (code === 'NOT_FOUND') {
      set.status = 404;
      return {
        success: false,
        message: 'Route not found',
        data: null
      };
    }
    
    if (code === 'VALIDATION') {
      set.status = 400;
      return {
        success: false,
        message: 'Validation error',
        error: error instanceof Error ? error.message : 'Unknown validation error',
        data: null
      };
    }
    
    set.status = 500;
    return {
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : undefined,
      data: null
    };
  });

// Connect to database and start server
async function startServer() {
  try {
    // Try to connect to MongoDB, but don't fail if it doesn't work
    try {
      await connectDB();
      console.log('✅ Database connected successfully');
    } catch (dbError: any) {
      console.warn('⚠️ Database connection failed:', dbError.message);
      console.warn('⚠️ Server will start without database functionality');
      console.warn('💡 For MongoDB Atlas: Make sure to whitelist your IP address or use 0.0.0.0/0 for access from anywhere');
    }
    
    // Start the server regardless of database connection
    // Railway provides PORT as an environment variable - it MUST be used
    const portString = process.env.PORT;
    if (!portString && process.env.RAILWAY_PUBLIC_DOMAIN) {
      throw new Error('Railway PORT environment variable is not set! Please check Railway configuration.');
    }
    
    const port = portString ? parseInt(portString, 10) : 3000;
    const hostname = '0.0.0.0'; // Always bind to all interfaces for Railway
    
    // Debug logging for Railway
    console.log(`🔍 Environment: NODE_ENV=${process.env.NODE_ENV || 'development'}`);
    console.log(`🔍 Port from ENV: "${process.env.PORT}" (parsed as: ${port})`);
    console.log(`🔍 Railway Domain: ${process.env.RAILWAY_PUBLIC_DOMAIN || 'Not set (local development)'}`);
    console.log(`🔍 All ENV keys:`, Object.keys(process.env).filter(key => key.includes('RAILWAY') || key === 'PORT'));
    
    app.listen({
      port: port,
      hostname: hostname
    });
    
    console.log(`🚀 Server is running on port ${port}`);
    console.log(`📚 Swagger documentation available at http://localhost:${port}/swagger`);
    if (process.env.RAILWAY_PUBLIC_DOMAIN) {
      console.log(`🌐 Public URL: https://${process.env.RAILWAY_PUBLIC_DOMAIN}`);
      console.log(`🌐 Swagger URL: https://${process.env.RAILWAY_PUBLIC_DOMAIN}/swagger`);
    }
  } catch (error: any) {
    console.error('❌ Failed to start server:', error);
    console.error('❌ Error details:', {
      message: error.message,
      code: error.code,
      syscall: error.syscall,
      port: process.env.PORT,
      parsedPort: Number(process.env.PORT)
    });
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n⏹️  Shutting down gracefully...');
  await closeDB();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n⏹️  Shutting down gracefully...');
  await closeDB();
  process.exit(0);
});

// Start the server
startServer();

export default app;
