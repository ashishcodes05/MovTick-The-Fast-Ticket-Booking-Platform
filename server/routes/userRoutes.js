import express from 'express';
import { getFavourites, getUserBookings, toggleFavoriteShow } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.get('/bookings', getUserBookings);
userRouter.post('/update-favourites', toggleFavoriteShow);
userRouter.get('/favourites', getFavourites);

export default userRouter;