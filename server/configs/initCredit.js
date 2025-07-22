import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Fix __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// API Key
const API_KEY = '6edf83fd1138d363aadb1a42183fd5f9';

// Correct file paths inside /server/configs
const moviesFilePath = path.join(__dirname, 'movies.json');
const outputFilePath = path.join(__dirname, 'real_credits.json');

async function fetchCredits(movieId) {
    const tmdbId = movieId;
    const url = `https://api.themoviedb.org/3/movie/${tmdbId}/credits?api_key=${API_KEY}`;

    try {
        const response = await axios.get(url);
        return { id: movieId, credits: response.data };
    } catch (error) {
        console.error(`❌ Failed for ${movieId}:`, error.response?.data?.status_message || error.message);
        return { id: movieId, credits: null, error: true };
    }
}

async function main() {
    try {
        const rawData = fs.readFileSync(moviesFilePath, 'utf8');
        const movies = JSON.parse(rawData);

        const creditsData = [];

        for (const movie of movies) {
            console.log(`🔍 Fetching credits for: ${movie.title}`);
            const credit = await fetchCredits(movie._id);
            creditsData.push(credit);
        }

        fs.writeFileSync(outputFilePath, JSON.stringify(creditsData, null, 2), 'utf8');
        console.log(`✅ Credits data saved to ${outputFilePath}`);
    } catch (err) {
        console.error('⚠️ Error:', err.message);
    }
}

main();
