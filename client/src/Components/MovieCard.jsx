import React from 'react'
import { assets } from '../assets/assets'
import { Star } from 'lucide-react'
import { useNavigate } from 'react-router';
import { useAppContext } from '../Context/AppContext';

const MovieCard = ({ movie }) => {
  const { imageurl } = useAppContext();
    const navigate = useNavigate();
  return (
    <div onClick={() => navigate(`/movies/${movie._id}`)} className='cursor-pointer hover:scale-102 transition-transform duration-300'>
        <div className='relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300'>
            <img className='w-full h-auto rounded-lg' src={movie.poster_path ? `${imageurl}${movie.poster_path}` : 'placeholder.jpg'} alt={movie.title} />
            <div className='absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-1 md:p-2 flex flex-col items-center justify-center gap-2'>
                <p className='text-sm text-gray-500 flex items-center'><Star className="w-6 h-6 text-accent fill-accent" /><span className='ml-1'>{movie.vote_average.toFixed(1)}/10</span></p>
            </div>
            <div className='absolute top-2 right-4 bg-primary text-white text-sm md:text-md px-2 py-1 rounded'>{new Date(movie.release_date).getFullYear()}</div>
        </div>
        <div className='p-2'>
          <h3 className='text-sm md:text-lg font-semibold'>{movie.title}</h3>
          <p className='text-xs md:text-sm text-gray-500'>{movie.genre_names.slice(0, 2).join(" | ")}</p>
        </div>
    </div>
  )
}

export default MovieCard
