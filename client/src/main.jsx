import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from "react-router";
import Home from './pages/Home.jsx';
import Movies from './pages/Movies.jsx';
import MovieDetails from './pages/MovieDetails.jsx';
import SeatLayout from './pages/SeatLayout.jsx';
import MyBookings from './pages/MyBookings.jsx';
import FavoriteMovies from './pages/FavoriteMovies.jsx';
import { ClerkProvider } from '@clerk/clerk-react'
import 'swiper/css';
import Booking from './pages/Booking.jsx';
import Error from './Components/Error.jsx';
import Layout from './pages/Admin/Layout.jsx';
import DashBoard from './pages/Admin/DashBoard.jsx';
import AddShows from './pages/Admin/AddShows.jsx';
import ListShows from './pages/Admin/ListShows.jsx';
import ListBookings from './pages/Admin/ListBookings.jsx';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: "/movies",
        element: <Movies />
      },
      {
        path: "/movies/:id",
        element: <MovieDetails />
      },
      {
        path: "/booking/:id",
        element: <Booking />
      },
      {
        path: "/movies/:id/:date",
        element: <SeatLayout />
      },
      {
        path: "/my-bookings",
        element: <MyBookings />
      },
      {
        path: "/favourite",
        element: <FavoriteMovies />
      }
    ]
  },
  {
    path: "/admin",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <DashBoard />
      },
      {
        path: "add-shows",
        element: <AddShows />
      },
      {
        path: "list-shows",
        element: <ListShows />
      },
      {
        path: "list-bookings",
        element: <ListBookings />
      }
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <RouterProvider router={router} />
    </ClerkProvider>
  </StrictMode>,
)
