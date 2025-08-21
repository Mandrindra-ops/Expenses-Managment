import { testDatabaseConnection, closeDatabaseConnection } from '../config/database';

const testConnection = async () => {
  try {
    console.log('🧪 Testing database connection...');
    const connected = await testDatabaseConnection();
    
    if (connected) {
      console.log('✅ Database connection test: PASSED');
      process.exit(0);
    } else {
      console.log('❌ Database connection test: FAILED');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error during connection test:', error);
    process.exit(1);
  } finally {
    await closeDatabaseConnection();
  }
};

testConnection();