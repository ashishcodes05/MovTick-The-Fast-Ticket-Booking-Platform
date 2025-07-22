import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const API_KEY = '6edf83fd1138d363aadb1a42183fd5f9';
const inputFilePath = path.join(__dirname, 'now_playing.json');
const outputFilePath = path.join(__dirname, 'now_playing_with_runtime_and_trailer.json');

async function fetchMovieDetails(movieId) {
  const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=en-US`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(`❌ Failed to fetch details for movie ID ${movieId}:`, error.message);
    return null;
  }
}

async function fetchTrailerKey(movieId) {
  const url = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}&language=en-US`;
  try {
    const response = await axios.get(url);
    const trailers = response.data.results;

    const youtubeTrailer = trailers.find(
      (video) => video.site === 'YouTube' && video.type === 'Trailer'
    );

    return youtubeTrailer ? youtubeTrailer.key : null;
  } catch (error) {
    console.error(`❌ Failed to fetch trailer for movie ID ${movieId}:`, error.message);
    return null;
  }
}

async function enrichMovies() {
  try {
    const movies = JSON.parse(fs.readFileSync(inputFilePath, 'utf8'));
    const enriched = [];

    for (const movie of movies) {
      const details = await fetchMovieDetails(movie.id);
      const trailerKey = await fetchTrailerKey(movie.id);

      if (details) {
        enriched.push({
          ...movie,
          runtime: details.runtime || null,
          trailerKey: trailerKey || null,
        });
        console.log(`✅ ${movie.title}: runtime = ${details.runtime}, trailer = ${trailerKey}`);
      }
    }

    fs.writeFileSync(outputFilePath, JSON.stringify(enriched, null, 2), 'utf8');
    console.log(`🎉 Enriched data saved to ${outputFilePath}`);
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

enrichMovies();
