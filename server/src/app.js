import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import notFound from './middleware/notFound.js';
import errorHandler from './middleware/errorHandler.js';
import authRoutes from './routes/auth.routes.js';
import planRoutes from './routes/plan.routes.js';
import subscriptionRoutes from './routes/subscription.routes.js';

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/subscriptions', subscriptionRoutes);

// Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'PayFlow API is running'
  });
});

// 404 and Global Error Handler
app.use(notFound);
app.use(errorHandler);

export default app;