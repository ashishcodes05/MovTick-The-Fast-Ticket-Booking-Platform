import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { assets, dummyCastsData, dummyDateTimeData, dummyShowsData } from "../assets/assets";
import MovieCard from "../Components/MovieCard";
import {
  Clapperboard,
  ClapperboardIcon,
  Heart,
  LucideTickets,
  Star,
} from "lucide-react";
import TimeConverter from "../lib/TimeConverter";
import dayjs from "dayjs";
import SelectDate from "../Components/SelectDate";
import Loader from "../Components/Loader";
import { useAppContext } from "../Context/AppContext";
import toast, { LoaderIcon } from "react-hot-toast";
import Trailer from "../Components/Trailer";

const MovieDetails = () => {
  const { id } = useParams();
  const { axios, getToken, shows, imageurl, backdropUrl, user, favouriteMovies, fetchFavoriteMovies } = useAppContext();
  const [show, setShow] = React.useState(null);
  const [cast, setCast] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [isAddingToFavourites, setIsAddingToFavourites] = React.useState(false);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = React.useState(false);
  const closeModal = () => setIsOpen(false);
  const openModal = () => setIsOpen(true);

  const fetchMovieDetails = async () => {
    const { data } = await axios.get(`/api/show/${id}`);
    if (data) {
      setShow({
        ...data.movie,
        dateTime: data.dateTime,
      });
    } else {
      console.error("Movie not found");
    }
  };

  const fetchCredits = async () => {
    try {
      const { data } = await axios.get(`/api/credits/${id}`);
      if (data.success) {
        setCast(data.creditData.credits.cast);
      } else {
        toast.error("Credits not found");
      }
    } catch (error) {
      console.error("Error fetching credits:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFavouriteToggle = async () => {
    try {
      if(!user.isSignedIn) {
        toast.error("Please sign in to add to favourites");
        return;
      }
      setIsAddingToFavourites(true);
      const { data } = await axios.post("/api/user/update-favourites", { movieId: id }, {
        headers: {
          Authorization: `Bearer ${await getToken()}`
        }
      });
      if(data.success) {
        await fetchFavoriteMovies();
        toast.success("Favourites updated successfully");
      }
    } catch (error) {
      console.error("Error updating favourites:", error);
      toast.error("Failed to update favourites");
    } finally {
      setIsAddingToFavourites(false);
    }
  }
    

  useEffect(() => {
    fetchMovieDetails();
    fetchCredits();
  }, [id]);

  window.scrollTo(0, 0);

  if (!show) return <Loader />;
  return !loading ? (
    <div>
      <div className="w-full h-screen relative">
        <img
          className="w-full h-full object-cover opacity-40"
          src={show.backdrop_path ? `${backdropUrl}${show.backdrop_path}` : assets.placeholder}
          alt=""
        />
        <div className="absolute inset-0 rounded-lg overflow-hidden flex items-center justify-center px-6 md:px-16 lg:px-36 mt-32">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-48 min-w-48 md:w-80 relative rounded-lg shadow-lg overflow-hidden">
              <img
                className="w-full h-full object-cover"
                src={show.poster_path ? `${imageurl}${show.poster_path}` : assets.placeholder}
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
              <h1 className="text-3xl md:text-5xl font-bold">{show.title}</h1>
              <p className="text-md text-accent flex items-center gap-2 mt-2">
                <Star className="w-6 h-6 text-accent fill-accent" />
                <span className="ml-1">
                  {show.vote_average.toFixed(1) || 9} / 10 Ratings
                </span>
              </p>
              <p className="text-sm">
                {show.genre_names.join(" | ")} &bull;{" "}
                {dayjs(show.release_date).format("D MMMM, YYYY")} &bull;{" "}
                <TimeConverter timeInMinutes={show.runtime} />
              </p>
              <p className="">{window.innerWidth < 768 ? show.overview.slice(0, 300) + "..." : show.overview}</p>
              <div className="flex items-center gap-4 mt-4">
                <button onClick={openModal} className="flex gap-1 items-center bg-accent text-primary px-4 py-2 rounded-md hover:scale-102 cursor-pointer">
                  <ClapperboardIcon className="w-4 h-4 mr-1" />
                  <span>Watch Trailer</span>
                </button>
                <button onClick={() => navigate(`/booking/${show._id}`)} className="flex gap-1 items-center bg-primary text-white px-4 py-2 rounded-md hover:scale-102 cursor-pointer">
                  <LucideTickets className="w-4 h-4 mr-1" />
                  <span>Book Tickets</span>
                </button>
                <button disabled={isAddingToFavourites} onClick={() => handleFavouriteToggle()} className="flex gap-1 items-center bg-gray-800 text-white px-3 py-3 rounded-full hover:scale-102 cursor-pointer">
                  {isAddingToFavourites ? <LoaderIcon className="w-6 h-6" /> : <Heart className={`w-6 h-6 text-red-500 hover:text-red-700 transition-colors ${favouriteMovies.map((movie) => movie._id).includes(id) ? "fill-red-500" : ""}`} />}
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
        <div className="flex gap-2 overflow-x-auto px-6 md:px-16 lg:px-36 py-2">
          {cast && cast.length > 0 ? (
            cast.slice(0, 8).map((cast) => (
              <div key={cast.id} className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-accent">
                  <img
                    className="w-full h-full object-cover"
                    src={ cast.profile_path ? `${imageurl}${cast.profile_path}` : assets.profile }
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

      <Trailer isOpen={isOpen} closeModal={closeModal} videoId={show.trailerKey} />

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
          {shows
            .filter((movie) => movie._id !== id)
            .slice(0, 4)
            .map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
        </div>
      </div>
    </div>
  ) : (
    <Loader />
  );
};

export default MovieDetails;
