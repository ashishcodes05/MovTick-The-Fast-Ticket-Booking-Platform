import React, { useEffect, useState } from 'react'
import { dummyShowsData } from '../../assets/assets';
import dayjs from 'dayjs';
import { useAppContext } from '../../Context/AppContext';
import Loader from '../../Components/Loader';

const ListShows = () => {
  const { axios, getToken, user } = useAppContext();
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAllShows = async () => {
    try {
      const { data } = await axios.get('/api/admin/all-shows', {
        headers: {
          Authorization: `Bearer ${await getToken()}`
        }
      });
      if (data.success) {
        setShows(data.shows);
      } else {
        toast.error("Failed to fetch shows.");
      }
    } catch (error) {
      console.error("Error fetching shows:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if(!user.isLoaded || !user.isSignedIn) {
      toast.error("Please sign in to view the shows.");
      return;
    }
    getAllShows();
  }, [])

  return !loading ? (
    <div className='max-w-4xl overflow-x-auto'>
      <h1 className="text-2xl font-bold py-2 mb-2 ml-2">Admin <span className="text-accent">Shows List</span></h1>
      <table className='w-full border-collapse rounded-md overflow-hidden text-nowrap'>
        <thead>
          <tr className='bg-primary/20 border-b border-accent/20 text-accent text-center'>
            <th className='p-2 font-medium pl-5'>Movie Name</th>
            <th className='p-2 font-medium'>Show Time</th>
            <th className='p-2 font-medium'>Total Bookings</th>
            <th className='p-2 font-medium'>Earnings</th>
          </tr>
        </thead>
        <tbody>
          {shows.map((show, index) => (
            <tr key={index} className='border-b border-accent/20 bg-primary/10 hover:bg-primary/20 text-center transition-colors duration-200'>
              <td className='p-2'>{show.movie.title}</td>
              <td className='p-2'>{dayjs(show.showDateTime).format('ddd, MMM D YYYY h:mm A')}</td>
              <td className='p-2'>{Object.keys(show.occupiedSeats).length} </td>
              <td className='p-2'>₹ {Object.keys(show.occupiedSeats).length * show.showPrice} </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <Loader />
  );
}

export default ListShows
