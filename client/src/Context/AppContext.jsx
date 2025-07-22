import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth, useClerk, useUser } from "@clerk/clerk-react";
import { useLocation, useNavigate } from "react-router";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
const imageurl = import.meta.env.TMDB_IMAGE_URL;

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [shows, setShows] = useState([]);
  const [favouriteMovies, setFavoriteMovies] = useState([]);
  const user = useUser();
  const { getToken } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const fetchIsAdmin = async () => {
    try {
      console.log("Checking admin status...");
      
      if (!user.isSignedIn || !user.user) {
        console.log("User not signed in");
        setIsAdmin(false);
        return;
      }
      
      const token = await getToken();
      if (!token) {
        console.error("No token available");
        setIsAdmin(false);
        return;
      }
      
      const { data } = await axios.get("/api/admin/is-admin", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      console.log("Admin check response:", data);
      
      if (data.success) {
        setIsAdmin(data.isAdmin || false);
        
        if (!data.isAdmin && location.pathname.startsWith("/admin")) {
          navigate("/");
          toast.error("You are not authorized to access this page.");
        }
      } else {
        setIsAdmin(false);
        console.error("Admin check failed:", data.message);
      }
    } catch (error) {
      console.error("Error fetching admin status:", error);
      setIsAdmin(false);
      
      if (error.response?.status === 401) {
        console.log("User not authenticated");
      } else if (error.response?.status === 403) {
        console.log("User is not an admin");
        if (location.pathname.startsWith("/admin")) {
          navigate("/");
          toast.error("You are not authorized to access this page.");
        }
      }
    }
  };

  const fetchShows = async () => {
    try {
      const { data } = await axios.get("/api/show/all");
      console.log(data.shows);
      if (data.success) {
        setShows(data.shows);
      } else {
        toast.error("Failed to fetch shows.");
      }
    } catch (error) {
      console.error("Error fetching shows:", error);
    }
  };

  const fetchFavoriteMovies = async () => {
    try {
      console.log("Fetching favorite movies...");
      
      if (!user.isSignedIn || !user.user) {
        console.log("User not signed in");
        return;
      }
      
      const token = await getToken();
      if (!token) {
        console.error("No token available");
        return;
      }
      
      console.log("Making request to /api/user/favourites");
      const { data } = await axios.get("/api/user/favourites", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      console.log("Response:", data);
      if (data.success) {
        setFavoriteMovies(data.movies || []);
        console.log("Favorite movies set:", data.movies?.length || 0);
      } else {
        console.error("API returned success: false", data);
        toast.error("Failed to fetch favorite movies.");
      }
    } catch (error) {
      console.error("Error fetching favorite movies:", error);
      console.error("Error response:", error.response?.data);
      if (error.response?.status === 401) {
        toast.error("Please sign in to view favorites");
      } else {
        toast.error("Failed to fetch favorite movies.");
      }
    }
  };

  useEffect(() => {
    if (user.isLoaded && user.isSignedIn && user.user) {
      fetchIsAdmin();
      fetchFavoriteMovies();
    } else if (user.isLoaded && !user.isSignedIn) {
      setFavoriteMovies([]);
      setIsAdmin(false);
    }
    fetchShows();
  }, [user.isLoaded, user.isSignedIn, user.user?.id]);

  const value = {
    axios,
    fetchIsAdmin,
    fetchShows,
    fetchFavoriteMovies,
    favouriteMovies,
    isAdmin,
    shows,
    user,
    getToken,
    imageurl: "https://image.tmdb.org/t/p/original",
    backdropUrl: "https://image.tmdb.org/t/p/original",

  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
