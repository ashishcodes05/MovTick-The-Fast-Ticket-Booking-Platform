import React, { useEffect, useState } from 'react'
import { dummyBookingData } from '../../assets/assets';
import Loader from '../../Components/Loader';
import dayjs from 'dayjs';

const ListBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAllBookings = async () => {
    setBookings(dummyBookingData);
    setLoading(false);
  }

  useEffect(() => {
    getAllBookings();
  }, [])
  return !loading ? (
    <div className='max-w-4xl  overflow-x-auto'>
      <h1 className="text-2xl font-bold py-2 mb-2 ml-2">Admin <span className="text-accent">Booking Lists</span></h1>
      <table className='w-full border-collapse rounded-md overflow-hidden text-nowrap'>
        <thead className='bg-primary/20 text-accent'>
          <tr className='border-b border-accent/20'>
            <th className='p-2 font-medium pl-5'>User</th>
            <th className='p-2 font-medium'>Movie</th>
            <th className='p-2 font-medium'>Show Time</th>
            <th className='p-2 font-medium'>Seats</th>
            <th className='p-2 font-medium'>Amount</th>
          </tr>
        </thead>
        <tbody className='bg-primary/10 text-sm'>
          {
            bookings.map((booking, index) => (
              <tr key={index} className='border-b border-accent/20 text-center hover:bg-primary/20 transition-colors duration-200'>
                <td className='p-2'>{booking.user.name}</td>
                <td className='p-2'>{booking.show.movie.title}</td>
                <td className='p-2'>{dayjs(booking.show.showDateTime).format('ddd, MMM D YYYY h:mm A')}</td>
                <td className='p-2'>{booking.bookedSeats.join(", ")}</td>
                <td className='p-2'>₹ {booking.amount}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  ) : (
    <Loader />
  )
}

export default ListBookings
