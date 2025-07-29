import React from "react";
import { dummyShowsData } from "../assets/assets";
import MovieCard from "../Components/MovieCard";
import { useAppContext } from "../Context/AppContext";

const Movies = () => {
  window.scrollTo(0, 0);
  const { shows, imageurl } = useAppContext();
  return (
    <>
      <div className=" mt-24 mb-12">
        <div className="flex items-center justify-between px-6 md:px-16 lg:px-36 pt-6 pb-12">
          <h2 className="text-lg md:text-2xl font-bold">Book Your Tickets Now </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 gap-y-8 px-6 md:px-16 lg:px-36">
          {shows.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Movies;
