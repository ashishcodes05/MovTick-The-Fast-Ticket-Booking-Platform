import axios from "axios";
import Movie from "../models/Movie.js";
import Show from "../models/Show.js";

const TMDB_API_KEY = process.env.TMDB_API_KEY;

export const getNowPlayingMovies = async (req, res) => {
  try {
    const movies = await Movie.find({}).sort({ release_date: -1 });
    res.send({ success: true, movies });
  } catch (error) {
    console.error(error);
    res.send({
      success: false,
      message: error.message || "Failed to fetch now playing movies.",
    });
  }
};

export const addShow = async (req, res) => {
  try {
    const { movieId, showsInput, showPrice } = req.body;
    if (!movieId || !showsInput || !showPrice) {
      return res
        .status(400)
        .send({ success: false, message: "Missing required fields." });
    }
    const showToCreate = [];
    showsInput.forEach((show) => {
      const showDate = show.date;
      show.time.forEach((time) => {
        const dateTimeString = `${showDate}T${time}`;
        showToCreate.push({
          movie: movieId,
          showDateTime: new Date(dateTimeString),
          showPrice: showPrice,
          occupedSeats: {},
        });
      });
    });

    if (showToCreate.length > 0) {
      await Show.insertMany(showToCreate);
    }

    res.json({ success: true, message: "Shows added successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: error.message || "Failed to add show.",
    });
  }
};

export const getShows = async (req, res) => {
  try {
    const shows = await Show.find({})
      .populate("movie")
      .sort({ showDateTime: 1 });
    //filter out duplicate shows by movie
    if (!shows || shows.length === 0) {
      return res
        .status(404)
        .send({ success: false, message: "No shows found." });
    }
    const uniqueShows = new Set(shows.map((show) => show.movie));
    res.send({ success: true, shows: Array.from(uniqueShows) });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: error.message || "Failed to fetch shows.",
    });
  }
};

export const getShowById = async (req, res) => {
  try {
    const { movieId } = req.params;
    const shows = await Show.find({ movie: movieId }).sort({ showDateTime: 1 });
    const movie = await Movie.findById(movieId);
    const dateTime = {};

    shows.forEach((show) => {
      const date = show.showDateTime.toISOString().split("T")[0];
      if (!dateTime[date]) {
        dateTime[date] = [];
      }
      dateTime[date].push({
        time: show.showDateTime,
        showId: show._id,
      });
    });

    res.send({ success: true, movie, dateTime });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: error.message || "Failed to fetch show.",
    });
  }
};
