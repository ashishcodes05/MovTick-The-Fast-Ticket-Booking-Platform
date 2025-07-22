
import fs from "fs";
import Movie from "../models/Movie.js";
import mongoose from "mongoose";
import Show from "../models/Show.js";
import Credit from "../models/Credit.js";

// const movies = JSON.parse(fs.readFileSync("./movies.json", "utf-8")); // Adjust path if needed
// const credits = JSON.parse(fs.readFileSync("./real_credits.json", "utf-8")); // Adjust path if needed

const seedMovies = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("MongoDB connected successfully");
    });
    await mongoose.connect("mongodb+srv://ashishomm2005:ashish123@cluster0.p7hnmyt.mongodb.net/movtick?retryWrites=true&w=majority");
    await Movie.deleteMany();
    console.log(`✅ Successfully deleted movies.`);
    await Movie.insertMany(movies);
    console.log(`✅ Successfully inserted ${movies.length} movies.`);
  } catch (err) {
    console.error("❌ Error seeding movies:", err);
  } finally {
    mongoose.connection.close();
  }
};

const seedCredits = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("MongoDB connected successfully");
    });
    await mongoose.connect("mongodb+srv://ashishomm2005:ashish123@cluster0.p7hnmyt.mongodb.net/movtick?retryWrites=true&w=majority");
    await Credit.deleteMany();
    console.log(`✅ Successfully deleted credits.`);
    await Credit.insertMany(credits);
    console.log(`✅ Successfully inserted ${credits.length} credits.`);
  } catch (err) {
    console.error("❌ Error seeding credits:", err);
  } finally {
    mongoose.connection.close();
  }
};

const deleteShows = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("MongoDB connected successfully");
    });
    await mongoose.connect("mongodb+srv://ashishomm2005:ashish123@cluster0.p7hnmyt.mongodb.net/movtick?retryWrites=true&w=majority");
    await Show.deleteMany();
    console.log(`✅ Successfully deleted shows.`);
  } catch (err) {
    console.error("❌ Error deleting shows:", err);
  } finally {
    mongoose.connection.close();
  }
};

deleteShows();
