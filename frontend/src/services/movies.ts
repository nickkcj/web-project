import axiosInstance from "./axiosInstance";
import { PATH } from "../path";

export interface MovieSummary {
  id: number;
  title: string;
  rating: number;
  release_date: string;
  poster_path: string;
}

export interface MovieDetails {
  id: number;
  title: string;
  overview: string;
  rating: number;
  poster: string;
  releaseDate: string;
  genres: string[];
}

export const getPopularMovies = async (limit = 20, page = 1): Promise<MovieSummary[]> => {
  const response = await axiosInstance.get<MovieSummary[]>(PATH.MOVIES.POPULAR, {
    params: { limit, page },
  });
  return response.data;
};

export const searchMovies = async (query: string): Promise<MovieSummary[]> => {
  const response = await axiosInstance.get<MovieSummary[]>(PATH.MOVIES.SEARCH, {
    params: { query },
  });
  return response.data;
};

export const getMovieDetails = async (id: number): Promise<MovieDetails> => {
  const response = await axiosInstance.get<MovieDetails>(`${PATH.MOVIES.ROOT}/${id}`);
  return response.data;
};
