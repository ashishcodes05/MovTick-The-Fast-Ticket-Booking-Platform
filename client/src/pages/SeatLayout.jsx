import React, { use, useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loader from "../Components/Loader";
import { useNavigate, useParams } from "react-router";
import { dummyDateTimeData, dummyShowsData } from "../assets/assets";
import dayjs from "dayjs";
import { ArrowRight } from "lucide-react";
import { useAppContext } from "../Context/AppContext";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const SeatLayout = () => {
  const { id, date } = useParams();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const [show, setShow] = useState(null);
  const [isProceeding, setIsProceeding] = useState(false);
  const navigate = useNavigate();
  const seatGroups = [
    ["J", "I"],
    ["H", "G"],
    ["F", "E"],
    ["D", "C"],
    ["B", "A"],
  ];

  const { axios, getToken, user } = useAppContext();
  const [loading, setLoading] = useState(true);
  const getShowDetails = async () => {
    try {
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
      console.error("Error fetching show details:", error);
    } finally {
      setLoading(false);
    }
  };

  const getOccupiedSeats = async () => {
    try {
      const { data } = await axios.get(
        `/api/booking/seats/${selectedTime.showId}`
      );
      if (data.success) {
        setOccupiedSeats(data.occupiedSeats);
      } else {
        toast.error("Error fetching occupied seats");
      }
    } catch (error) {
      console.error("Error fetching occupied seats:", error);
    }
  };

  const bookTickets = async () => {
    try {
      if (!user.isSignedIn) {
        toast.error("Please sign in to book tickets");
        return;
      }
      if (!selectedTime || selectedSeats.length === 0) {
        toast.error("Please select a time and at least one seat");
        return;
      }
      MySwal.fire({
        title: "Confirm Booking",
        text: `You are about to book ${selectedSeats.length} seat(s) for ${
          show.title
        } at ${dayjs(selectedTime.time).format("hh:mm A")} on ${dayjs(
          date
        ).format("dddd, DD MMMM YYYY")}. Do you want to proceed?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, book now!",
        cancelButtonText: "No, cancel",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const { data } = await axios.post(
            "/api/booking/create",
            {
              showId: selectedTime.showId,
              selectedSeats,
            },
            {
              headers: { Authorization: `Bearer ${await getToken()}` },
            }
          );
          if (data.success) {
            if (data.url) {
              // Redirect to Stripe payment gateway
              window.location.href = data.url;
            } else {
              toast.success("Tickets booked successfully!");
              navigate("/my-bookings");
            }
          } else {
            toast.error(data.message || "Error booking tickets");
          }
        }
      });
    } catch (error) {
      console.error("Error booking tickets:", error);
      toast.error("Error booking tickets. Please try again.");
    }
  };

  useEffect(() => {
    getShowDetails();
  }, []);

  useEffect(() => {
    if (selectedTime) {
      getOccupiedSeats();
    }
  }, [selectedTime]);

  const handleSeatSelection = (seat) => {
    if (!selectedTime) {
      toast.error("Please select a time first");
      return;
    }

    // Prevent selection of occupied seats
    if (occupiedSeats.includes(seat)) {
      toast.error("This seat is already occupied");
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
      const isOccupied = occupiedSeats.includes(seat);
      const isSelected = selectedSeats.includes(seat);

      return (
        <button
          key={seat}
          onClick={() => handleSeatSelection(seat)}
          disabled={isOccupied}
          className={`w-8 h-8 text-xs rounded border font-medium transition duration-200
            ${
              isSelected
                ? "bg-accent text-primary border-accent"
                : isOccupied
                ? "bg-red-600 text-white border-red-600 opacity-50 cursor-not-allowed"
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
      <div className="bg-primary/20 border border-accent rounded-lg p-6 mb-8 flex flex-col gap-2">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-md md:text-xl font-bold text-white">Booking Details:</h1>
          <h1 className="text-xl md:text-3xl font-bold text-white">{show.title}</h1>
          <h1 className="text-accent text-md md:text-xl">
            {dayjs(date).format("dddd, DD MMMM YYYY")}
          </h1>
          <h2 className="text-md md:text-xl text-gray-300">
            Selected Time:{" "}
            {selectedTime ? dayjs(selectedTime.time).format("hh:mm A") : "None"}
          </h2>
          <h2 className="text-md md:text-lg text-gray-400">
            Selected Seats ({selectedSeats.length} / 5):{" "}
            {selectedSeats.length > 0 ? (
              <span className="text-white">{selectedSeats.join(", ")}</span>
            ) : (
              <span className="text-gray-500">None</span>
            )}
          </h2>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-4 mt-4">
          <h1 className="text-white text-sm md:text-lg font-semibold mb-2">
            Available Timings
          </h1>
          <div className="flex items-center flex-wrap gap-4">
            {show.dateTime[date].map((item) => (
              <div
                onClick={() => setSelectedTime(item)}
                className={`border px-2 md:px-4 py-2 rounded-md cursor-pointer transition  ${
                  selectedTime?.time === item.time
                    ? "bg-accent text-primary border-accent"
                    : "border-primary text-white hover:bg-primary/40"
                }`}
                key={item.time}
              >
                <p className="text-sm md:text-md">{dayjs(item.time).format("hh:mm A")}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Seat Layout Section */}
      <div>
        <h1 className="text-md md:text-xl font-bold text-white mb-6 text-center">
          Grab your seats
        </h1>
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
          disabled={isProceeding}
          className={`bg-primary text-sm md:text-md flex items-center space-x-1 md:space-x-2 px-2 md:px-4 py-2 rounded-md text-white mt-4 hover:bg-accent hover:text-primary transition-colors ${
            isProceeding ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={() => {
            bookTickets();
          }}
        >
          {isProceeding ? "Processing..." : "Proceed"} <ArrowRight className="inline-block" />
        </button>
      </div>
    </div>
  );
};

export default SeatLayout;
