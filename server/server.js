import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv/config';
import connectDB from './configs/db.js';
import { clerkMiddleware } from '@clerk/express'
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js"
import showRouter from './routes/showRoutes.js';
import bookingRouter from './routes/bookingRoutes.js';
import adminRouter from './routes/adminRoutes.js';
import userRouter from './routes/userRoutes.js';
import creditRouter from './routes/creditRoutes.js';
import { stripeWebhookHandler } from './controllers/stripeWebhooks.js';

const app = express();
const PORT = process.env.PORT || 3000;

await connectDB();

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(clerkMiddleware());

// Stripe Webhooks Route - MUST be before express.json() middleware
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), stripeWebhookHandler);
app.get('/api/stripe/webhook', (req, res) => {
    res.json({ message: 'Stripe webhook endpoint is active', timestamp: new Date().toISOString() });
});

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

app.get('/', (req, res) => {
  res.send('Welcome to the MovTick Server!');
});
app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/show", showRouter);
app.use("/api/booking", bookingRouter);
app.use("/api/admin", adminRouter);
app.use("/api/user", userRouter);
app.use("/api/credits", creditRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
