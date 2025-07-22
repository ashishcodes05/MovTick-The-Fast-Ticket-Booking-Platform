import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Your TMDb API key
const API_KEY = '6edf83fd1138d363aadb1a42183fd5f9';

// File to save the movie data
const outputFilePath = path.join(__dirname, 'now_playing_movies.json');

async function fetchNowPlayingMovies() {
  try {
    const url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`;
    const response = await axios.get(url);

    // Take the first 20 results (usually already 20, but we slice to be sure)
    const movies = response.data.results.slice(0, 20);

    // Save to file
    fs.writeFileSync(outputFilePath, JSON.stringify(movies, null, 2), 'utf8');
    console.log(`✅ Fetched and saved ${movies.length} now playing movies to ${outputFilePath}`);
  } catch (err) {
    console.error('❌ Error fetching now playing movies:', err.response?.data || err.message);
  }
}

fetchNowPlayingMovies();
