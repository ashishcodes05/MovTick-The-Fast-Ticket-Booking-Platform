import React from "react";
import { dummyShowsData } from "../assets/assets";
import MovieCard from "../Components/MovieCard";

const Movies = () => {
  const [stopScroll, setStopScroll] = React.useState(false);
  window.scrollTo(0, 0);
  return (
    <>
      <style>{`
                .marquee-inner {
                    animation: marqueeScroll linear infinite;
                }

                @keyframes marqueeScroll {
                    0% {
                        transform: translateX(0%);
                    }

                    100% {
                        transform: translateX(-50%);
                    }
                }
            `}
      </style>
        <div className="px-6 md:px-16 lg:px-36 pt-10">
          <p className="text-2xl font-semibold mt-20">Now Showing</p>
        </div>
      <div
        className="overflow-hidden w-full relative max-w-6xl mx-auto mt-8 mb-10"
        onMouseEnter={() => setStopScroll(true)}
        onMouseLeave={() => setStopScroll(false)}
      >
        <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none" />
        <div
          className="marquee-inner flex w-fit"
          style={{
            animationPlayState: stopScroll ? "paused" : "running",
            animationDuration: dummyShowsData.length * 1500 + "ms",
          }}
        >
          <div className="flex">
            {dummyShowsData.map((movie) => (
              <div
                key={movie._id}
                className="w-72 mx-4 h-[24rem] relative group hover:scale-90 transition-all duration-300"
              >
                <img
                  src={movie.poster_path}
                  alt="card"
                  className="w-full h-full object-cover"
                />
                <div className="flex items-center justify-center px-4 opacity-0 group-hover:opacity-100 transition-all duration-300 absolute bottom-0 backdrop-blur-md left-0 w-full h-full bg-black/20">
                  <p className="text-white text-lg font-semibold text-center">
                    {movie.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="py-10">
        <div className="flex items-center justify-between px-6 md:px-16 lg:px-36 py-5">
          <h2 className="text-2xl font-bold">Book Your Tickets Now </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 gap-y-8 px-6 md:px-16 lg:px-36">
          {dummyShowsData.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>

      </div>
    </>
  );
};

export default Movies;
