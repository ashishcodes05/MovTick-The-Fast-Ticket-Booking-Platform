import React, { useEffect, useState } from 'react'
import { dummyBookingData } from '../assets/assets';
import Loader from '../Components/Loader';
import dayjs from 'dayjs';
import { UserButton } from '@clerk/clerk-react';
import { Clock1 } from 'lucide-react';

const MyBookings = () => {
  window.scrollTo(0, 0);
  const [bookings, setBookings] = useState([]); // Assuming you will fetch bookings data
  const fetchBookings = async () => {
    setBookings(dummyBookingData); // Replace with actual API call
  }

  useEffect(() => {
    fetchBookings();
  }, [bookings]);

  if(!bookings) return <Loader />

  return (
    <div className='min-h-screen px-6 md:px-16 lg:px-36 mt-24 '>
      <h1 className='text-2xl font-bold mb-4'>My Bookings</h1>
      <div className='flex flex-col gap-4 text-white'>
        {
          dummyBookingData.map((booking) => (
            <div key={booking._id} className='flex items-center max-w-3xl bg-primary/20 py-4 px-12 rounded-md'>
              <div className='w-16 md:w-24 rounded-lg overflow-hidden'>
                <img src={booking.show.movie.poster_path} className='w-full h-full object-cover' alt="" />
              </div>
              <div className='flex flex-col gap-2 ml-4'>
                <h1 className='text-xl font-semibold'>{booking.show.movie.title}</h1>
                <p>{booking.show.movie.genres.map((genre) => genre.name).join(', ')}</p>
                <p className='text-sm text-gray-300'>Date: {dayjs(booking.show.showDateTime.date).format('dddd, MMMM D YYYY')}</p>
                <p className='text-sm text-gray-300'>Time: {dayjs(booking.show.showDateTime.date).format('h:mm A')}</p>
                
              </div>
              <div className='ml-auto flex flex-col items-center gap-2 '>
                <div className='flex items-center gap-2'>
                  <p className='text-3xl '>₹{booking.amount}</p>
                  {!booking.isPaid ? (<p className='text-sm flex items-center text-gray-300'><Clock1 className='w-4 h-4 mr-1' /> Pending</p>) : (<p className='text-sm text-gray-300'>Paid</p>)}
                </div>
                <p>Total Seats: {booking.bookedSeats.length}</p>
                <p>Seat Number: {booking.bookedSeats.join(', ')}</p>
                {!booking.isPaid && (<button className='bg-primary hover:bg-accent hover:text-primary text-white py-1 px-2 rounded'>Pay Now</button>)}
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default MyBookings
