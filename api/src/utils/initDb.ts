import { exec } from 'child_process';
import util from 'util';
import path from 'path';

const execAsync = util.promisify(exec);

const createDbIfNotExists = async () => {
  try {    
    console.log('Generating Prisma Client...');
    await execAsync('npx prisma generate');
    
    console.log('Pushing Prisma Schema...');
    await execAsync('npx prisma db push');

    console.log('Database setup complete');
  } catch (error) {
    console.error('Error in database initialization:', error);
    throw error;
  }
};

export default createDbIfNotExists; 