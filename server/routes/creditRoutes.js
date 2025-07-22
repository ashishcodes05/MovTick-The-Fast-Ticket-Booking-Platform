import express from "express";
import { getCreditsByMovieId } from "../controllers/creditController.js";

const creditRouter = express.Router();

creditRouter.get("/:movieId", getCreditsByMovieId);

export default creditRouter;