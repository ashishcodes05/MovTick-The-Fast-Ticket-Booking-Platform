
import MovieCard from '../Components/MovieCard';
import { useAppContext } from '../Context/AppContext';

const FavoriteMovies = () => {
  const { axios, getToken, user, favouriteMovies } = useAppContext();
  return (
    <div className='min-h-screen px-6 md:px-16 lg:px-36 mt-32'>
      {favouriteMovies.length > 0 ? (
        <>
          <h1 className="text-2xl font-bold mb-6">Your Favourite Movies</h1>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {favouriteMovies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        </>
      ) : (
        <p>No favourite movies found.</p>
      )}
    </div>
  )
}

export default FavoriteMovies
