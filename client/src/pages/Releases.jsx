import React, { useState } from 'react'
import { useAppContext } from '../Context/AppContext';
import { useNavigate } from 'react-router';

const Releases = () => {
  const { shows, imageurl } = useAppContext();
    const [stopScroll, setStopScroll] = useState(false);
    const navigate = useNavigate();
    window.scrollTo(0, 0);
    return (
      <div className="min-h-screen">
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
        `}</style>
  
        <div className="px-6 md:px-16 lg:px-36 pt-10">
          <p className="text-2xl font-semibold mt-20">New Releases</p>
        </div>
  
        <div
          className="overflow-hidden w-full relative max-w-[1200px] mx-auto mt-8 mb-10"
          onMouseEnter={() => setStopScroll(true)}
          onMouseLeave={() => setStopScroll(false)}
        >
          <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none" />
  
          <div
            className="marquee-inner flex w-fit"
            style={{
              animationPlayState: stopScroll ? "paused" : "running",
              animationDuration: "60s",
            }}
          >
            {[...shows, ...shows].map((movie, index) => (
              <div
              onClick={() => navigate(`/movies/${movie._id}`)}
                key={movie._id + index}
                className="w-96 h-[28rem] md:w-72 mx-4 md:h-[28rem] relative group hover:scale-90 transition-all duration-300 cursor-pointer"
              >
                <img
                  src={
                    movie.poster_path
                      ? `${imageurl}${movie.poster_path}`
                      : "placeholder.jpg"
                  }
                  alt="poster"
                  className="w-full h-full object-cover rounded-lg"
                />
                <div className="flex items-center justify-center px-4 opacity-0 group-hover:opacity-100 transition-all duration-300 absolute bottom-0 backdrop-blur-md left-0 w-full h-full bg-black/30">
                  <p className="text-white text-lg font-semibold text-center">
                    {movie.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
}

export default Releases
