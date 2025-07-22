import {
  BadgeIndianRupee,
  ChartLine,
  IndianRupee,
  PlayCircleIcon,
  Star,
  StarIcon,
  UsersIcon,
} from "lucide-react";
import React, { useEffect } from "react";
import { dummyDashboardData } from "../../assets/assets";
import Loader from "../../Components/Loader";
import dayjs from "dayjs";
import { useAppContext } from "../../Context/AppContext";
import toast from "react-hot-toast";

const DashBoard = () => {

  const { axios, getToken, user, imageurl } = useAppContext();

  const [dashBoardData, setDashboardData] = React.useState({
    totalBookings: 0,
    activeShows: [],
    totalUsers: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = React.useState(true);
  const dashBoardCards = [
    {
      title: "Total Bookings",
      value: dashBoardData.totalBookings || 0,
      icon: <ChartLine className="w-6 h-6" />,
    },
    {
      title: "Total Revenue",
      value: `₹ ${dashBoardData.totalRevenue || 0}`,
      icon: <BadgeIndianRupee className="w-6 h-6" />,
    },
    {
      title: "Active Shows",
      value: dashBoardData.activeShows.length || 0,
      icon: <PlayCircleIcon className="w-6 h-6" />,
    },
    {
      title: "Total Users",
      value: dashBoardData.totalUsers || 0,
      icon: <UsersIcon className="w-6 h-6" />,
    },
  ];

  const fetchDashboardData = async () => {
    try {
      const { data } = await axios.get("/api/admin/dashboard", {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      });
      if (data.success) {
        setDashboardData(data.dashboardData);
      } else {
        toast.error("Failed to fetch dashboard data.");
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setDashboardData(dummyDashboardData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(!user.isLoaded || !user.isSignedIn) {
      toast.error("Please sign in to view the dashboard.");
      return;
    }
    fetchDashboardData();
  }, []);
  return !loading ? (
    <div className="overflow-y-auto h-screen scrollbar-none">
      <h1 className="text-2xl font-bold py-2 mb-2 ml-2">Admin <span className="text-accent">Dashboard</span></h1>
      <div className="flex flex-wrap gap-4 items-center mb-8">
        {dashBoardCards.map((card, index) => (
          <div
            key={index}
            className="flex items-center justify-between max-w-52 w-full bg-primary/20 gap-10 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex flex-col gap-2">
              <h3>{card.title}</h3>
              <p className="text-lg font-semibold text-accent">{card.value}</p>
            </div>
            <div className="flex flex-col items-center">{card.icon}</div>
          </div>
        ))}
      </div>

      {dashBoardData.activeShows.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {dashBoardData.activeShows.map((show) => (
            <div
              key={show._id}
              className="bg-primary/20 p-4 rounded-lg shadow-md"
            >
              <div className="w-full h-80 overflow-hidden rounded-md ">
                <img
                  className="w-full h-full object-cover"
                  src={show.movie.poster_path ? `${imageurl}${show.movie.poster_path}` : 'placeholder.jpg'}
                  alt={show.movie.title}
                />
              </div>
             <div className="flex flex-col mt-4">
               <h3 className="text-lg font-semibold text-white truncate">
                {show.movie.title}
              </h3>
              <div className="flex items-center justify-between text-gray-300">
                <h2 className="text-xl text-accent font-semibold">₹ {show.showPrice}</h2>
                <p className="flex items-center gap-1"><Star className="w-5 h-5 text-accent fill-accent" />{show.movie.vote_average.toFixed(1)}</p>
              </div>
              <p className="text-sm text-gray-300">
                {dayjs(show.showDateTime).format("dddd, DD MMMM YYYY")} at {dayjs(show.showDateTime).format("hh:mm A")}
              </p>
             </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No active shows at the moment.</p>
      )}
    </div>
  ) : (
    <Loader />
  );
};

export default DashBoard;
