import { ArrowRightIcon } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router";
import { assets, dummyShowsData } from "../assets/assets";
import MovieCard from "./MovieCard";
import { useAppContext } from "../Context/AppContext";

const FeatureSection = () => {
  const navigate = useNavigate();
  const { shows } = useAppContext();
  return (
    <>
      <div className="py-10">
        <div className="flex items-center justify-between px-6 md:px-16 lg:px-36 py-5">
          <h2 className="text-2xl font-bold">Now Showing</h2>
          <button
            onClick={() => navigate("/movies")}
            className="flex items-center gap-2 text-primary cursor-pointer"
          >
            View All <ArrowRightIcon />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 px-6 md:px-16 lg:px-36">
          {shows.slice(0, 4).map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>

      </div>
      <div className="py-10">
        <div className="flex items-center justify-between px-6 md:px-16 lg:px-36 py-5">
          <h2 className="text-2xl font-bold">Recommended Movies</h2>
          <button
            onClick={() => navigate("/movies")}
            className="flex items-center gap-2 text-primary cursor-pointer"
          >
            View All <ArrowRightIcon />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 px-6 md:px-16 lg:px-36">
          {shows.slice(4, 8).map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>
        <div className="flex py-8 justify-center">
          <button
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-accent hover:text-primary transition-colors"
            onClick={() => navigate("/movies")}
          >
            Load More...
          </button>
        </div>
      </div>
    </>
  );
};

export default FeatureSection;
