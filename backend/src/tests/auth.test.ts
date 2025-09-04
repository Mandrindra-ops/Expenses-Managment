import sequelize from '../utils/database';
import { signup, login } from '../services/auth.service';

const testAuth = async () => {
  try {
    await sequelize.sync({ force: true }); 

    console.log('--- SIGNUP ---');
    const user = await signup('test@example.com', 'password123');
    console.log('User created:', user.email);

    console.log('--- LOGIN ---');
    const { user: loggedUser, token } = await login('test@example.com', 'password123');
    console.log('Logged in:', loggedUser.email);
    console.log('JWT token:', token);

  } catch (error: any) {
    console.error('Error:', error.message);
  } finally {
    await sequelize.close();
  }
};

testAuth();
