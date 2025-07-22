import express from 'express';
import { addShow, getNowPlayingMovies, getShowById, getShows } from '../controllers/showController.js';
import { protectAdmin } from '../middlewares/auth.js';

const showRouter = express.Router();

showRouter.get("/now-playing", protectAdmin, getNowPlayingMovies);
showRouter.post("/add", protectAdmin, addShow);
showRouter.get("/all", getShows);
showRouter.get("/:movieId", getShowById);

export default showRouter;