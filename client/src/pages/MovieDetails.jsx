import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import {
  assets,
  dummyCastsData,
  dummyDateTimeData,
  dummyShowsData,
} from "../assets/assets";
import MovieCard from "../Components/MovieCard";
import {
  Clapperboard,
  ClapperboardIcon,
  Clock,
  Heart,
  LucideTickets,
  Star,
} from "lucide-react";
import dayjs from "dayjs";
import SelectDate from "../Components/SelectDate";
import Loader from "../Components/Loader";
import { useAppContext } from "../Context/AppContext";
import toast, { LoaderIcon } from "react-hot-toast";
import Trailer from "../Components/Trailer";
import { kConverter } from "../lib/kConverter";
import TimeConverter from "../lib/TimeConverter";

const MovieDetails = () => {
  const { id } = useParams();
  const {
    axios,
    getToken,
    shows,
    imageurl,
    backdropUrl,
    user,
    favouriteMovies,
    fetchFavoriteMovies,
  } = useAppContext();
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
      if (!user.isSignedIn) {
        toast.error("Please sign in to add to favourites");
        return;
      }
      setIsAddingToFavourites(true);
      const { data } = await axios.post(
        "/api/user/update-favourites",
        { movieId: id },
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      );
      if (data.success) {
        await fetchFavoriteMovies();
        toast.success("Favourites updated successfully");
      }
    } catch (error) {
      console.error("Error updating favourites:", error);
      toast.error("Failed to update favourites");
    } finally {
      setIsAddingToFavourites(false);
    }
  };

  useEffect(() => {
    fetchMovieDetails();
    fetchCredits();
  }, [id]);

  window.scrollTo(0, 0);

  if (!show) return <Loader />;
  return !loading ? (
    <div>
      <div className="min-h-screen relative flex flex-col md:flex-row  items-center px-6 md:px-16 lg:px-36 py-10 ">
        <div className="absolute inset-0 bg-black opacity-30">
          <img
            className="w-full h-full object-cover"
            src={
              show.backdrop_path
                ? `${backdropUrl}${show.backdrop_path}`
                : assets.noImage
            }
            alt=""
          />
        </div>
        <div className="flex-1/4 flex items-center justify-center flex-col gap-4 relative z-10">
          <div className="w-38 md:w-72 rounded-lg overflow-hidden shadow-lg relative">
            <img
              className="w-full h-full object-cover rounded-lg shadow-lg"
              src={
                show.poster_path
                  ? `${imageurl}${show.poster_path}`
                  : assets.noImage
              }
              alt=""
            />
            <p className="absolute bottom-0 w-full bg-black text-accent py-2 flex items-center justify-center">
              In Cinemas Now
            </p>
          </div>
        </div>
        <div className="flex-3/4 z-10 flex flex-col gap-2 px-4">
          <h2 className="px-2 py-2 w-12 bg-primary text-white rounded-md flex items-center justify-center">
            2D
          </h2>
          <p className="text-sm text-accent">English/Hindi</p>
          <h1 className="text-xl md:text-4xl font-bold">{show.title}</h1>
          <div className="flex items-center gap-2">
            <Star className="text-yellow-500 fill-yellow-500" />
            <span>{show.vote_average.toFixed(1)}</span>
            <span>({kConverter(show.vote_count)} votes)</span>
          </div>
          <div className="flex flex-col gap-1 ">
            <p className="max-md:text-sm text-md">
              {show.genre_names.join(" | ")}
            </p>
            <div className="flex items-center gap-1 max-md:text-sm text-md">
              <p className="flex items-center gap-1 max-md:text-sm text-md">
                <Clock />
                <TimeConverter timeInMinutes={show.runtime} />
              </p>
              <p className="max-md:text-sm text-md">
                &bull; {dayjs(show.release_date).format("MMMM D, YYYY")}
              </p>
            </div>
          </div>
          <p className="max-md:text-sm text-md">
            {window.innerWidth > 768
              ? show.overview
              : show.overview.substring(0, 200) + "..."}
          </p>
          <div className="flex items-center gap-4 mt-8">
            <button
              onClick={openModal}
              className="bg-accent text-primary max-md:text-sm py-2 px-4 flex items-center gap-1 rounded-lg hover:bg-accent/80 cursor-pointer"
            >
              <Clapperboard /> Watch Trailer
            </button>
            <button
              onClick={() => navigate(`/booking/${id}`)}
              className="bg-primary text-accent py-2 px-4 max-md:text-sm flex items-center gap-1 rounded-lg hover:bg-primary/80 cursor-pointer"
            >
              <LucideTickets /> Book Tickets
            </button>
            <button
              className={`bg-gray-900 text-accent py-2 px-2 flex items-center gap-1 rounded-full hover:bg-primary/80 cursor-pointer ${
                isAddingToFavourites ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={handleFavouriteToggle}
              disabled={isAddingToFavourites}
            >
              <Heart
                className={`${
                  favouriteMovies.map((movie) => movie._id).includes(id)
                    ? "fill-red-500"
                    : ""
                }`}
              />
            </button>
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
                    src={
                      cast.profile_path
                        ? `${imageurl}${cast.profile_path}`
                        : assets.profile
                    }
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

      <Trailer
        isOpen={isOpen}
        closeModal={closeModal}
        videoId={show.trailerKey}
      />

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
