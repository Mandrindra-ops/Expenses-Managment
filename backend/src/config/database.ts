import { Pool } from 'pg';
import { config } from './index';

// Create database connection pool with optimized settings
export const pool = new Pool({
  host: config.database.host,
  port: config.database.port,
  database: config.database.name,
  user: config.database.user,
  password: config.database.password,
  
  // Connection pool optimization
  max: 20, // maximum number of clients in the pool
  idleTimeoutMillis: 30000, // close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // return error after 2 seconds if connection fails
});

// Test database connection function
export const testDatabaseConnection = async (): Promise<boolean> => {
  let client;
  try {
    client = await pool.connect();
    console.log('✅ Database connection successful');
    
    // Test basic query
    const result = await client.query('SELECT NOW() as current_time');
    console.log('✅ Database time:', result.rows[0].current_time);
    
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  } finally {
    if (client) {
      client.release();
    }
  }
};

// Graceful shutdown function
export const closeDatabaseConnection = async (): Promise<void> => {
  await pool.end();
  console.log('Database connection pool closed');
};

// Helper function to get database stats (useful for debugging)
export const getPoolStats = () => {
  return {
    totalCount: pool.totalCount,
    idleCount: pool.idleCount,
    waitingCount: pool.waitingCount,
  };
};