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

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
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
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <RouterProvider router={router} />
    </ClerkProvider>
  </StrictMode>,
)
