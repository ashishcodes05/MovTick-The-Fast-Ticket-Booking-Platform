import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const API_KEY = '6edf83fd1138d363aadb1a42183fd5f9';

const inputFilePath = path.join(__dirname, 'now_playing_movies.json');
const outputFilePath = path.join(__dirname, 'now_playing_with_genres.json');

async function getGenreMap() {
  const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`;

  const response = await axios.get(url);
  const genresArray = response.data.genres;

  const genreMap = {};
  for (const genre of genresArray) {
    genreMap[genre.id] = genre.name;
  }

  return genreMap;
}

async function mapGenres() {
  try {
    const genreMap = await getGenreMap();
    const movies = JSON.parse(fs.readFileSync(inputFilePath, 'utf8'));

    const updatedMovies = movies.map(movie => {
      const genre_names = movie.genre_ids.map(id => genreMap[id] || 'Unknown');
      return { ...movie, genre_names };
    });

    fs.writeFileSync(outputFilePath, JSON.stringify(updatedMovies, null, 2), 'utf8');
    console.log(`✅ Saved with genre names to ${outputFilePath}`);
  } catch (err) {
    console.error('❌ Error mapping genres:', err.message);
  }
}

mapGenres();