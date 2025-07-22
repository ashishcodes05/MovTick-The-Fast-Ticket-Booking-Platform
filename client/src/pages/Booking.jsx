import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { dummyDateTimeData, dummyShowsData } from "../assets/assets";
import SelectDate from "../Components/SelectDate";
import Loader from "../Components/Loader";
import TimeConverter from "../lib/TimeConverter";
import { useAppContext } from "../Context/AppContext";

const Booking = () => {
  const { id } = useParams();
  const { shows, imageurl, backdropUrl, axios } = useAppContext();
  console.log("shows", shows);
  const [show, setShow] = useState(null);
  const fetchMovieDetails = async () => {
    try{
      const { data } = await axios.get(`/api/show/${id}`);
      if (data.success) {
        setShow({
          ...data.movie,
          dateTime: data.dateTime,
        });
      } else {
        console.error("Movie not found");
      }
    } catch (error) {
      console.error("Error fetching movie details:", error);
    }
  };
  useEffect(() => {
    fetchMovieDetails();
  }, [id]);
  if (!show) return <Loader />;
  return (
    <div className="relative">
      <div className="w-full h-screen relative mb-8">
        <img
          className="w-full h-full object-cover opacity-40"
          src={`${backdropUrl}${show.backdrop_path}`}
          alt={show.title}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="flex flex-col items-center text-white mt-20">
            <img
              src={show.poster_path ? `${imageurl}${show.poster_path}` : 'placeholder.jpg'}
              alt={show.title}
              className="w-48 object-cover mt-4 mb-4 rounded-lg shadow-sm shadow-black"
            />
            <h1 className="text-2xl font-bold ">
              {show.title}
            </h1>
            <p className="text-sm mb-2">
              {show.genre_names.join(" | ")} &bull;{" "}
              <TimeConverter timeInMinutes={show.runtime} />
            </p>
            <h1 className="text-2xl font-bold text-accent">
              Grab Tickets Now !
            </h1>
          </div>
          <SelectDate dateTime={show.dateTime} id={show._id} />
        </div>
      </div>
    </div>
  );
};

export default Booking;
