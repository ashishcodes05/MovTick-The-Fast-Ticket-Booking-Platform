import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { assets, dummyDateTimeData, dummyShowsData } from "../assets/assets";
import MovieCard from "../Components/MovieCard";
import {
  Clapperboard,
  ClapperboardIcon,
  LucideTickets,
  Star,
} from "lucide-react";
import TimeConverter from "../lib/TimeConverter";
import dayjs from "dayjs";
import SelectDate from "../Components/SelectDate";
import Loader from "../Components/Loader";

const MovieDetails = () => {
  const { id } = useParams();
  const [show, setShow] = React.useState(null);
  const navigate = useNavigate();

  const fetchMovieDetails = async () => {
    const movie = dummyShowsData.find((movie) => movie._id === id);
    if (movie) {
      setShow({
        ...movie,
        dateTime: dummyDateTimeData,
      });
    } else {
      console.error("Movie not found");
    }
  };

  useEffect(() => {
    fetchMovieDetails();
  }, [id]);

  window.scrollTo(0, 0);

  if (!show) return <Loader />;
  return (
    <div>
      <div className="w-full h-screen relative">
        <img
          className="w-full h-full object-cover opacity-40"
          src={show ? show.backdrop_path : ""}
          alt=""
        />
        <div className="absolute inset-0 rounded-lg overflow-hidden px-6 md:px-16 lg:px-36 mt-32">
          <div className="flex items-center gap-6">
            <div className="w-80 relative rounded-lg shadow-lg overflow-hidden">
              <img
                className="w-full h-full object-cover"
                src={show ? show.poster_path : ""}
                alt=""
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2 flex flex-col items-center justify-center gap-2">
                <p className="text-accent">In Cinemas Now</p>
              </div>
            </div>
            <div className="flex flex-col gap-2 max-w-2xl text-white">
              <h2 className="px-4 py-2 flex items-center justify-center bg-primary w-14 rounded-full">
                2D
              </h2>
              <h1 className="text-5xl font-bold">{show.title}</h1>
              <p className="text-md text-accent flex items-center gap-2 mt-2">
                <Star className="w-6 h-6 text-accent fill-accent" />
                <span className="ml-1">
                  {show.vote_average.toFixed(1)} / 10 Ratings
                </span>
              </p>
              <p className="text-sm">
                {show.genres.map((genre) => genre.name).join(" | ")} &bull;{" "}
                {dayjs(show.release_date).format("D MMMM, YYYY")} &bull;{" "}
                <TimeConverter timeInMinutes={show.runtime} />
              </p>
              <p className="">{show.overview}</p>
              <div className="flex items-center gap-4 mt-4">
                <a href="#trailer" className="flex gap-1 items-center bg-accent text-primary px-4 py-2 rounded-md hover:scale-102 cursor-pointer">
                  <ClapperboardIcon className="w-4 h-4 mr-1" />
                  <span>Watch Trailer</span>
                </a>
                <button onClick={() => navigate(`/booking/${show._id}`)} className="flex gap-1 items-center bg-primary text-white px-4 py-2 rounded-md hover:scale-102 cursor-pointer">
                  <LucideTickets className="w-4 h-4 mr-1" />
                  <span>Book Tickets</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="bookTickets">
        <div className="flex items-center justify-between px-6 md:px-16 lg:px-36 py-5">
          <h2 className="text-2xl font-bold">Cast & Crew</h2>
        </div>
        <div className="flex px-6 md:px-16 lg:px-36 py-2">
          {show.casts && show.casts.length > 0 ? (
            show.casts.slice(0, 8).map((cast) => (
              <div key={cast.id} className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-accent">
                  <img
                    className="w-full h-full object-cover"
                    src={cast.profile_path}
                    alt={cast.name}
                  />
                </div>
                <div className="flex flex-col text-center items-center px-2 mt-2 max-w-32">
                  <h3 className="text-md font-semibold">{cast.name}</h3>
                </div>
              </div>
            ))
          ) : (
            <p>No cast information available.</p>
          )}
        </div>
      </div>
      
      <div className="px-6 md:px-16 lg:px-36 py-5" id="trailer">
        <div className="flex items-center justify-between ">
          <h2 className="text-2xl font-bold">Trailer</h2>
        </div>
        <div className="flex justify-center mt-4">
          <iframe
            width="640"
            height="360"
            src="https://www.youtube.com/embed/6txjTWLoSc8?si=HrLBTO0emv4WmBop"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen
          ></iframe>
        </div>
      </div>
      <div className="py-10">
        <div className="flex items-center justify-between px-6 md:px-16 lg:px-36 py-5">
          <h2 className="text-2xl font-bold">Similar Movies</h2>
          <button
            className="text-accent cursor-pointer"
            onClick={() => {
              navigate("/movies");
            }}
          >
            See All
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-6 md:px-16 lg:px-36">
          {dummyShowsData
            .filter((movie) => movie._id !== id)
            .slice(0, 4)
            .map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
