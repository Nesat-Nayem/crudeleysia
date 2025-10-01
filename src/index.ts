import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { cors } from '@elysiajs/cors';
import { connectDB, closeDB, prisma } from './config/prisma';
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
          description: 'ElysiaJS User CRUD API with PostgreSQL (Prisma)',
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
              : `http://localhost:${process.env.APP_PORT || process.env.PORT || 3000}`,
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
      await prisma.$queryRaw`SELECT 1`;
      return {
        success: true,
        message: 'API and database are healthy',
        status: {
          api: 'healthy',
          database: 'connected'
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
    // Try to connect to PostgreSQL, but don't fail if it doesn't work
    try {
      await connectDB();
      console.log('✅ Database connected successfully');
    } catch (dbError: any) {
      console.warn('⚠️ Database connection failed:', dbError.message);
      console.warn('⚠️ Server will start without database functionality');
    }
    
    // Start the server regardless of database connection
    // Port selection
    // - In local development, Bun's dev server sets PORT (e.g., 2020). Avoid using it for the app server to prevent EADDRINUSE.
    // - Use APP_PORT locally. In Railway/production, use PORT.
    const appPortEnv = process.env.APP_PORT;
    const bunDevPort = process.env.PORT; // set by Bun dev server when using --watch
    const isRailway = Boolean(process.env.RAILWAY_PUBLIC_DOMAIN);

    if (!bunDevPort && isRailway) {
      throw new Error('Railway PORT environment variable is not set! Please check Railway configuration.');
    }

    const port = appPortEnv
      ? parseInt(appPortEnv, 10)
      : isRailway && bunDevPort
        ? parseInt(bunDevPort, 10)
        : 3000;
    const hostname = '0.0.0.0'; // Always bind to all interfaces for Railway
    
    // Debug logging for Railway
    console.log(`🔍 Environment: NODE_ENV=${process.env.NODE_ENV || 'development'}`);
    console.log(`🔍 APP_PORT: "${process.env.APP_PORT}"  PORT: "${process.env.PORT}"  -> using: ${port}`);
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
