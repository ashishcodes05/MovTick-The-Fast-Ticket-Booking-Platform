import React, { useEffect, useState } from "react";
import { dummyShowsData } from "../../assets/assets";
import Loader from "../../Components/Loader";
import { CheckIcon, DeleteIcon, StarIcon } from "lucide-react";
import { kConverter } from "../../lib/kConverter";
import { useAppContext } from "../../Context/AppContext";
import toast from "react-hot-toast";

const AddShows = () => {
  const { axios, getToken, user, imageurl } = useAppContext();
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [dateTimeSelection, setDateTimeSelection] = useState({});
  const [dateTimeInput, setDateTimeInput] = useState("");
  const [showPrice, setShowPrice] = useState("");
  const [addingShow, setAddingShow] = useState(false);
  console.log(selectedMovie);

  const fetchNowPlayingMovies = async () => {
    try {
      console.log("Fetching now playing movies...");
      const { data } = await axios.get('/api/show/now-playing', {
        headers: {
          Authorization: `Bearer ${await getToken()}`
        }
      });
      console.log("API Response:", data);
      if(data.success){
        setNowPlayingMovies(data.movies);
        console.log("Movies set:", data.movies.length);
      } else {
        console.error("API returned success: false, using dummy data");
        setNowPlayingMovies(dummyShowsData);
      }
    } catch(err){
      console.error("Error fetching movies, using dummy data:", err);
      setNowPlayingMovies(dummyShowsData);
    }
  };

  const handleDateTimeAdd = () => {
    if (!dateTimeInput) return;
    const [date, time] = dateTimeInput.split("T");
    if (!date || !time) return;

    setDateTimeSelection((prev) => {
      const times = prev[date] || [];
      if (!times.includes(time)) {
        return { ...prev, [date]: [...times, time] };
      }
      return prev;
    });
  };

  const handleRemoveTime = (date, time) => {
    setDateTimeSelection((prev) => {
      const filteredTimes = (prev[date] || []).filter((t) => t !== time);
      if (filteredTimes.length === 0) {
        const { [date]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [date]: filteredTimes };
    });
  };

  const handleAddShow = async () => {
    if (!selectedMovie || Object.keys(dateTimeSelection).length === 0 || !showPrice) {
      return toast.error("Missing required fields");
    }
    setAddingShow(true);
    try {
      const showsInput = Object.entries(dateTimeSelection).map(([date, times]) => ({
        date,
        time: times
      }));

      const { data } = await axios.post('/api/show/add', {
        movieId: selectedMovie,
        showsInput,
        showPrice
      }, {
        headers: {
          Authorization: `Bearer ${await getToken()}`
        }
      });
      if(data.success){
        setDateTimeSelection({});
        setShowPrice("");
        setDateTimeInput("");
        toast.success("Show added successfully");
      } else {
        toast.error("Failed to add show");
      }
    } catch (err) {
      console.error("Error adding show:", err);
    } finally {
      setAddingShow(false);
    }
  };

  useEffect(() => {
    fetchNowPlayingMovies();
  }, []);

  return nowPlayingMovies.length > 0 ? (
    <>
      <h1 className="text-2xl font-bold py-2">
        Admin <span className="text-accent">Add Shows</span>
      </h1>
      <p className="mt-2 text-lg font-medium">Now Playing Movies</p>
      <div className="overflow-x-auto pb-4">
        <div className="group flex flex-wrap gap-4 mt-4 w-max">
          {nowPlayingMovies.map((movie) => (
            <div
              key={movie._id}
              className={`relative max-w-40 cursor-pointer group-hover:not-hover:opacity-40 hover:-translate-y-1 transition duration-300`}
              onClick={() => setSelectedMovie(movie._id)}
            >
              <div className="relative rounded-lg overflow-hidden">
                <img
                  src={movie.poster_path ? `${imageurl}${movie.poster_path}` : 'placeholder.jpg'}
                  alt={movie.title}
                  className="w-full object-cover brightness-90"
                />
                <div className="text-sm flex items-center justify-between p-2 bg-black/70 w-full absolute bottom-0 left-0">
                  <p className="flex items-center gap-1 text-gray-400">
                    <StarIcon className="w-4 h-4 text-accent fill-accent" />{" "}
                    {movie.vote_average ? movie.vote_average.toFixed(1) : '0.0'}
                  </p>
                  <p className="text-gray-300">
                    {kConverter(movie.vote_count || 0)} Votes
                  </p>
                </div>
              </div>
              {selectedMovie === movie._id && (
                <div className="absolute top-2 right-2 flex items-center justify-center bg-primary h-6 w-6 rounded">
                  <CheckIcon className="w-4 h-4 text-white" strokeWidth={2.5} />
                </div>
              )}
              <p className="font-medium truncate">{movie.title}</p>
              <p className="text-gray-400 text-sm">{movie.release_date}</p>
            </div>
          ))}
        </div>
      </div>
      {/* Show Price Input */}
      <div className="mt-8">
        <label className="block text-sm font-medium mb-2">Show Price</label>
        <div className="inline-flex items-center gap-2 border border-gray-600 px-3 py-2 rounded-md">
          <p>₹</p>
          <input
            min={0}
            type="number"
            value={showPrice}
            onChange={(e) => setShowPrice(e.target.value)}
            placeholder="Enter Show Price"
            className="outline-none"
          />
        </div>
      </div>
      {/* Date & Time Selection */}
      <div className="mt-6">
        <label className="block text-sm font-medium mb-2">
          Select Date and Time
        </label>
        <div className="inline-flex gap-5 border border-gray-600 p-1 pl-3 rounded-lg">
          <input
            type="datetime-local"
            value={dateTimeInput}
            onChange={(e) => setDateTimeInput(e.target.value)}
            className="outline-none rounded-md"
          />
          <button
            type="button"
            onClick={() => handleDateTimeAdd()}
            className="bg-primary/80 text-white px-3 py-2 text-sm rounded-lg hover:bg-primary cursor-pointer"
          >
            Add Time
          </button>
        </div>
      </div>
      {/* {Display selected Times} */}
      {Object.keys(dateTimeSelection).length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-medium mb-2">Selected Show Times</h2>
          <ul className="list-inside">
            {Object.entries(dateTimeSelection).map(([date, times]) => (
              <li key={date}>
                <div className="font-medium">{date}</div>
                <div className="flex flex-wrap gap-2 mt-1 text-sm">
                  {times.map((time) => (
                    <div key={time} className="border border-primary px-2 py-1 rounded-md flex items-center gap-2">
                      <span>{time}</span>
                      <DeleteIcon className="w-4 h-4 text-red-500 cursor-pointer" onClick={() => handleRemoveTime(date, time)} />
                    </div>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      <button onClick={handleAddShow} type="submit" disabled={addingShow} className="mt-6 bg-primary text-white px-4 py-2 rounded-md hover:bg-accent hover:text-primary transition-colors cursor-pointer">
        {addingShow ? "Adding..." : "Add Shows"}
      </button>
    </>
  ) : (
    <Loader />
  );
};

export default AddShows;
