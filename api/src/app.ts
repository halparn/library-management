import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes';
import bookRoutes from './routes/bookRoutes';
import createDbIfNotExists from './utils/initDb';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// request logger middleware
app.use((req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const timestamp = new Date().toLocaleTimeString();
    const duration = Date.now() - start;
    console.log(
      `${timestamp} ${req.method} ${res.statusCode} ${req.originalUrl} ${req.ip} ${duration}ms`
    );
  });

  next();
});

app.use(cors());
app.use(express.json());

const startServer = async () => {
  try {
    // initialize prisma client
    await createDbIfNotExists();

    // routes
    app.use('/users', userRoutes);
    app.use('/books', bookRoutes);

    // error handling middleware
    app.use(errorHandler);

    const PORT = process.env.PORT || 8080;

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app; 