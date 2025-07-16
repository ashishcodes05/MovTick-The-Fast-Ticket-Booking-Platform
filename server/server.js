import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv/config';
import { connect } from 'mongoose';
import connectDB from './configs/db.js';
import { clerkMiddleware } from '@clerk/express'
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js"

const app = express();
const PORT = process.env.PORT || 3000;

await connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(clerkMiddleware())

app.get('/', (req, res) => {
  res.send('Welcome to the MovTick Server!');
});
app.use("/api/inngest", serve({ client: inngest, functions }));


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
