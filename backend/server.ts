import { app } from './app';
import { config } from './config';
import { testDatabaseConnection, closeDatabaseConnection } from './config/database';

const startServer = async () => {
  try {
    console.log('🚀 Starting server with configuration:');
    console.log(`   Environment: ${config.nodeEnv}`);
    console.log(`   Port: ${config.port}`);
    console.log(`   Database: ${config.database.name}@${config.database.host}`);

    // Test database connection
    console.log('🔌 Testing database connection...');
    const dbConnected = await testDatabaseConnection();
    
    if (!dbConnected) {
      throw new Error('Failed to connect to database. Please check your credentials and ensure PostgreSQL is running.');
    }

    // Start the server
    app.listen(config.port, () => {
      console.log('✅ Server started successfully!');
      console.log(`📍 Server URL: http://localhost:${config.port}`);
      console.log(`📊 API Base URL: http://localhost:${config.port}/api`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
const shutdown = async (signal: string) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  
  try {
    await closeDatabaseConnection();
    console.log('✅ Cleanup completed. Server stopped.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
};

// Listen for termination signals
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error);
  shutdown('uncaughtException');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  shutdown('unhandledRejection');
});

// Start the servers
startServer();