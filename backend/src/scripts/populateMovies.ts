import { TMDBService } from '../services/tmdb.service';
import { prisma } from '../config/database';
import DatabaseService from '../config/database';

interface TMDBMovie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  release_date: string;
  popularity: number;
  original_language: string;
}

async function populateMovies() {
  try {
    await DatabaseService.connect();
    console.log('Starting movie population...');
    let totalMovies = 0;
    let page = 1;
    const targetCount = 1000;

    while (totalMovies < targetCount) {
      console.log(`Fetching page ${page}...`);
      const response = await TMDBService.getPopularMovies(page);
      const movies = response.results as TMDBMovie[];

      if (!movies || movies.length === 0) {
        console.log('No more movies to fetch');
        break;
      }

      // Transform TMDB movies to match our schema
      const moviesToInsert = movies.map((movie: TMDBMovie) => ({
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path || '',
        backdrop_path: movie.backdrop_path || '',
        overview: movie.overview || '',
        release_date: movie.release_date || '',
        popularity: movie.popularity || 0,
        original_language: movie.original_language || 'en'
      }));

      // Insert movies in batches
      for (const movie of moviesToInsert) {
        try {
          await prisma.$queryRaw`
            INSERT INTO "Movie" (id, title, poster_path, backdrop_path, overview, release_date, popularity, original_language, "createdAt", "updatedAt")
            VALUES (${movie.id}, ${movie.title}, ${movie.poster_path}, ${movie.backdrop_path}, ${movie.overview}, ${movie.release_date}, ${movie.popularity}, ${movie.original_language}, NOW(), NOW())
            ON CONFLICT (id) DO UPDATE SET
              title = EXCLUDED.title,
              poster_path = EXCLUDED.poster_path,
              backdrop_path = EXCLUDED.backdrop_path,
              overview = EXCLUDED.overview,
              release_date = EXCLUDED.release_date,
              popularity = EXCLUDED.popularity,
              original_language = EXCLUDED.original_language,
              "updatedAt" = NOW()
          `;
          totalMovies++;
          if (totalMovies % 100 === 0) {
            console.log(`Inserted ${totalMovies} movies so far...`);
          }
        } catch (error) {
          console.error(`Error inserting movie ${movie.id}:`, error);
        }
      }

      if (totalMovies >= targetCount) {
        console.log(`Reached target count of ${targetCount} movies`);
        break;
      }

      page++;
    }

    console.log(`Finished populating movies. Total inserted: ${totalMovies}`);
  } catch (error) {
    console.error('Error populating movies:', error);
  } finally {
    await DatabaseService.disconnect();
  }
}

// Run the script
populateMovies(); 