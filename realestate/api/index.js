import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
import cookieParser from 'cookie-parser';
import path from 'path';

dotenv.config();

const __dirname = path.resolve();

const app = express();

app.use(express.json());

app.use(cookieParser());
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);

const PORT = process.env.PORT || 5000


app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
})

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});


mongoose.connect(process.env.MONGO_URI ,{

  useNewUrlParser: true,

  useUnifiedTopology: true,
}).then(() => {
  console.log("Connected to DataBase Successfully");
})

.catch(() => {
  console.error("The Database doesnt connected successfully");
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
