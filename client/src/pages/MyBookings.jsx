import React, { useEffect, useState } from "react";
import { dummyBookingData } from "../assets/assets";
import Loader from "../Components/Loader";
import dayjs from "dayjs";
import { UserButton } from "@clerk/clerk-react";
import { Clock1 } from "lucide-react";
import { useAppContext } from "../Context/AppContext";
import { Link } from "react-router";

const MyBookings = () => {
  window.scrollTo(0, 0);
  const [bookings, setBookings] = useState([]); // Assuming you will fetch bookings data
  const { axios, getToken, user, imageurl } = useAppContext();
  const [loading, setLoading] = useState(true);
  const fetchBookings = async () => {
    try {
      if (!user.isSignedIn || !user.user) {
        console.log("User not signed in");
        return;
      }
      const token = await getToken();
      if (!token) {
        console.error("No token available");
        return;
      }
      const { data } = await axios.get("/api/user/bookings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (data.success) {
        setBookings(data.bookings || []);
      } else {
        console.error("Failed to fetch bookings:", data.message);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(user.isSignedIn) {
      fetchBookings();
    }
  }, [user.isSignedIn]);

  // Add effect to refetch bookings when the page becomes visible (useful after payment redirect)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && user.isSignedIn) {
        fetchBookings();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Also refetch when the page loads (useful for payment returns)
    if (user.isSignedIn) {
      fetchBookings();
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user.isSignedIn]);

  return !loading ? (
    <div className="min-h-screen px-6 md:px-16 lg:px-36 mt-24 mb-16 ">
      <h1 className="text-2xl font-bold mb-4">My Bookings</h1>
      <div className="flex flex-col gap-4 text-white">
        {bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <p className="text-gray-300">No bookings found.</p>
          </div>
        ) : (
          bookings.map((booking) => (
            <div
              key={booking._id}
              className="flex items-center md:min-h-48 max-w-4xl bg-primary/20 gap-2 py-4 px-2 md:px-12 rounded-md"
            >
              <div className="w-16 md:w-24 rounded-lg overflow-hidden">
                <img
                  src={`${imageurl}${booking.show.movie.poster_path}`}
                  className="w-full h-full object-cover"
                  alt=""
                />
              </div>
              <div className="flex flex-col gap-1 md:gap-4 md:ml-4 flex-2/3">
                <h1 className="md:text-2xl font-semibold">
                  {booking.show.movie.title}
                </h1>
                <p className="max-md:text-xs text-xl text-gray-300">
                  Date:{" "}
                  {dayjs(booking.show.showDateTime.date).format(
                    "dddd, MMMM D YYYY"
                  )}
                </p>
                <p className="max-md:text-xs text-xl text-gray-300">
                  Time: {dayjs(booking.show.showDateTime.date).format("h:mm A")}
                </p>
              </div>
              <div className="ml-auto flex flex-col items-center gap-1 md:gap-4 flex-1/3">
                <div className="flex items-center gap-2">
                  <p className="text-xs md:text-3xl text-accent ">₹{booking.amount}</p>
                </div>
                <p className="max-md:text-xs">Total Seats: {booking.bookedSeats.length}</p>
                <p className="max-md:text-xs">Seat No: {booking.bookedSeats.join(", ")}</p>
                {!booking.isPaid ? (
                  <Link to={booking.paymentLink} className="bg-primary hover:bg-accent max-md:text-xs flex items-center hover:text-primary text-white py-1 px-2 rounded">
                    <p className="text-sm flex items-center text-gray-300">
                      <Clock1 className="w-4 h-4 mr-1" />
                    </p>
                    pending
                  </Link>
                ): (
                  <p className="max-md:text-xs text-gray-300">Paid</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  ) : (
    <Loader />
  );
};

export default MyBookings;
