import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { dummyDateTimeData, dummyShowsData } from "../assets/assets";
import SelectDate from "../Components/SelectDate";
import Loader from "../Components/Loader";
import TimeConverter from "../lib/TimeConverter";

const Booking = () => {
  const { id } = useParams();
  const [show, setShow] = useState(null);
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
  if (!show) return <Loader />;
  return (
    <div className="relative">
      <div className="w-full h-screen relative mb-8">
        <img
          className="w-full h-full object-cover opacity-40"
          src={show.backdrop_path}
          alt=""
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="flex flex-col items-center text-white mt-20">
            <img
              src={show.poster_path}
              alt={show.title}
              className="w-48 object-cover mt-4 mb-4 rounded-lg shadow-sm shadow-black"
            />
            <h1 className="text-2xl font-bold ">
              {show.title}
            </h1>
            <p className="text-sm mb-2">
              {show.genres.map((genre) => genre.name).join(" | ")} &bull;{" "}
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
