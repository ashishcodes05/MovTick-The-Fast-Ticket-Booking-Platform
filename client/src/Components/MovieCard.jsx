import React from 'react'
import { assets } from '../assets/assets'
import { Star } from 'lucide-react'
import { useNavigate } from 'react-router';

const MovieCard = ({ movie }) => {
    const navigate = useNavigate();
  return (
    <div onClick={() => navigate(`/movies/${movie._id}`)} className='cursor-pointer hover:scale-102 transition-transform duration-300'>
        <div className='relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300'>
            <img className='w-full h-auto rounded-lg' src={movie.poster_path} alt="" />
            <div className='absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2 flex flex-col items-center justify-center gap-2'>
                <p className='text-sm text-gray-500 flex items-center'><Star className="w-6 h-6 text-accent fill-accent" /><span className='ml-1'>{movie.vote_average.toFixed(1)}/10</span></p>
            </div>
            <div className='absolute top-2 right-4 bg-primary text-white px-2 py-1 rounded'>{new Date(movie.release_date).getFullYear()}</div>
        </div>
        <div className='p-2'>
          <h3 className='text-lg font-semibold'>{movie.title}</h3>
          <p className='text-sm text-gray-500'>{movie.genres.slice(0, 2).map((genre) => genre.name).join(" | ")}</p>
        </div>
    </div>
  )
}

export default MovieCard
