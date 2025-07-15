import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loader from "../Components/Loader";
import { useNavigate, useParams } from "react-router";
import { dummyDateTimeData, dummyShowsData } from "../assets/assets";
import dayjs from "dayjs";
import { ArrowRight } from "lucide-react";

const SeatLayout = () => {
  window.scrollTo(0, 0);
  const { id, date } = useParams();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [show, setShow] = useState(null);
  const navigate = useNavigate();
  const seatGroups = [
    ["J", "I"],
    ["H", "G"],
    ["F", "E"],
    ["D", "C"],
    ["B", "A"],
  ];

  const getShowDetails = async () => {
    const movie = dummyShowsData.find((movie) => movie._id === id);
    if (movie) {
      setShow({
        ...movie,
        dateTime: dummyDateTimeData,
      });
    } else {
      toast.error("Movie not found");
    }
  };

  useEffect(() => {
    getShowDetails();
  }, []);

  const handleSeatSelection = (seat) => {
    if (!selectedTime) {
      toast.error("Please select a time first");
      return;
    }
    if (!selectedSeats.includes(seat) && selectedSeats.length >= 5) {
      toast.error("You can only select up to 5 seats");
      return;
    }
    setSelectedSeats((prevState) =>
      prevState.includes(seat)
        ? prevState.filter((s) => s !== seat)
        : [...prevState, seat]
    );
  };

  const renderSeats = (row, count = 9) => {
    return Array.from({ length: count }, (_, index) => {
      const seat = `${row}${index + 1}`;
      return (
        <button
          key={seat}
          onClick={() => handleSeatSelection(seat)}
          className={`w-8 h-8 text-xs rounded border font-medium transition duration-200
            ${
              selectedSeats.includes(seat)
                ? "bg-accent text-primary border-accent"
                : "text-white border-red-600 hover:bg-red-600"
            }
          `}
        >
          {seat}
        </button>
      );
    });
  };

  if (!show) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen px-6 md:px-16 lg:px-36 mt-24">
      <div className="bg-primary/20 rounded-lg p-6 mb-8 flex flex-col gap-2">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-3xl font-bold text-white">
            {show.title} 
          </h1>
          <h1 className="text-accent text-xl">{dayjs(date).format("dddd, DD MMMM YYYY")}</h1>
          <h2 className="text-xl text-gray-300">
            Selected Time:{" "}
            {selectedTime ? dayjs(selectedTime.time).format("hh:mm A") : "None"}
          </h2>
          <h2 className="text-lg text-gray-400">
            Selected Seats ({selectedSeats.length} / 5): {
              selectedSeats.length > 0 ? (
                <span className="text-white">{selectedSeats.join(", ")}</span>
              ) : (
                <span className="text-gray-500">None</span>
              )
            }
          </h2>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-4 mt-4">
          <h1 className="text-white text-lg font-semibold mb-2">
            Available Timings
          </h1>
          <div className="flex items-center flex-wrap gap-4">
            {show.dateTime[date].map((item) => (
              <div
                onClick={() => setSelectedTime(item)}
                className={`border px-4 py-2 rounded-md cursor-pointer transition  ${
                  selectedTime?.time === item.time
                    ? "bg-accent text-primary border-accent"
                    : "border-primary text-white hover:bg-primary/40"
                }`}
                key={item.time}
              >
                <p>{dayjs(item.time).format("hh:mm A")}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Seat Layout Section */}
      <div>
        <h1 className="text-xl font-bold text-white mb-6 text-center">Grab your seats</h1>
        <div className="mb-8">
          {seatGroups[0].map((group, index) => (
            <div
              key={index}
              className="flex items-center justify-center gap-2 mb-2"
            >
              {renderSeats(group[0])}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {seatGroups.slice(1).map((group, index) => (
            <div key={index} className="mb-4">
              <div className="flex items-center justify-center gap-2 mb-2 ">
                {renderSeats(group[0])}
              </div>
              <div className="flex items-center justify-center gap-2">
                {renderSeats(group[1])}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-2xl mx-auto h-3 bg-gradient-to-r from-gray-700 via-gray-500 to-gray-700 rounded-b-full shadow-inner text-center text-sm text-white"></div>
      <h1 className="text-center text-lg font-semibold text-white mt-2">
        All eyes this way please!
      </h1>
      <div className="flex items-center justify-center gap-4 mt-4">
        <button
          className="bg-primary px-4 py-2 rounded-md text-white mt-4 hover:bg-accent hover:text-primary transition-colors"
          onClick={() => {
            if (selectedSeats.length === 0) {
              toast.error("Please select at least one seat");
              return;
            }
            navigate("/my-bookings");
          }}
        >
          Proceed <ArrowRight className="inline-block ml-2" />
        </button>
      </div>
    </div>
  );
};

export default SeatLayout;
