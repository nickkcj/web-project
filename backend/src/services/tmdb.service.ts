import axios from 'axios';
import {MovieFallbackService} from "./moviefallback.service";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export class TMDBService {
  private constructor() {}

  public static async getPopularMovies(page: number = 1, limit: number = 20) {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
        params: {
          api_key: TMDB_API_KEY,
          page,
        },
      });
      return response.data.results.slice(0, limit);
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      return MovieFallbackService.getPopularMovies(page);
    }
  }

  public static async getMovieDetails(movieId: number) {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}`, {
        params: {
          api_key: TMDB_API_KEY,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching movie details:', error);
      return MovieFallbackService.getMovieDetails(movieId);
    }
  }

  public static async searchMovies(query: string, page: number = 1) {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
        params: {
          api_key: TMDB_API_KEY,
          query,
          page,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error searching movies:', error);
      return MovieFallbackService.searchByTitle(query, page);
    }
  }

  public static async getMoviesByGenre(genre: Number = 28) {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/discover/movie`, {
        params: {
          api_key: TMDB_API_KEY,
          with_genres: genre,
        },
      });
      return response.data.results;
    } catch (error) {
      console.error('Error fetching movies by genre:', error);
      return MovieFallbackService.getPopularMovies(1);
    }
  }
}