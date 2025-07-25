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
      if (!user.isSignedIn || !user.user) {
        setIsAdmin(false);
        return;
      }
      
      const token = await getToken();
      if (!token) {
        setIsAdmin(false);
        return;
      }
      
      const { data } = await axios.get("/api/admin/is-admin", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (data.success) {
        setIsAdmin(data.isAdmin || false);
        
        if (!data.isAdmin && location.pathname.startsWith("/admin")) {
          navigate("/");
          toast.error("You are not authorized to access this page.");
        }
      } else {
        setIsAdmin(false);
      }
    } catch (error) {
      console.error("Error fetching admin status:", error);
      setIsAdmin(false);
      
      if (error.response?.status === 401) {
        // User not authenticated
      } else if (error.response?.status === 403) {
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
      if (!user.isSignedIn || !user.user) {
        return;
      }
      
      const token = await getToken();
      if (!token) {
        return;
      }
      
      const { data } = await axios.get("/api/user/favourites", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (data.success) {
        setFavoriteMovies(data.movies || []);
      } else {
        toast.error("Failed to fetch favorite movies.");
      }
    } catch (error) {
      console.error("Error fetching favorite movies:", error);
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
