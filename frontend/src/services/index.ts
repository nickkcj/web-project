import axios from "axios";
import { PATH } from "../path";

const api = axios.create({
  baseURL: PATH.base,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
    });

    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/login') && !currentPath.includes('/register')) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

const services = {
  // USER SERVICES
  registerUser: async (body: { name: string; email: string; password: string }) => {
    try {
      const response = await api.post('/users', body);
      return response.data;
    } catch (err: any) {
      if (err.response?.data && Array.isArray(err.response.data)) {
        const errorMessage = err.response.data[0];
        if (errorMessage === "This email is already in use.") {
          throw new Error("Este e-mail já está em uso.");
        } else {
          throw new Error(errorMessage);
        }
      }
      throw new Error("Erro inesperado. Tente novamente.");
    }
  },

  loginUser: async (body: { email: string; password: string }) => {
    try {
      const response = await api.post('/users/login', body);
      return response.data;
    } catch (err: any) {
      if (err.response?.status === 401) {
        throw new Error("Credenciais inválidas.");
      }
      throw new Error("Erro ao tentar fazer login.");
    }
  },

  getUserProfile: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },

  getUserById: async (id: number) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  getUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  updateUserProfile: async (data: { name?: string; email?: string; password?: string }) => {
    try {
      const response = await api.put('/users/me', data);
      return response.data;
    } catch (error: any) {
      console.error('Update profile error:', error);
      throw error;
    }
  },

  // MOVIE SERVICES
  getPopularMovies: async (page = 1) => {
    const response = await api.get(`/movies/popular?page=${page}`);
    return response.data;
  },

  searchMovies: async (query: string, page = 1) => {
    const response = await api.get(`/movies/search?query=${encodeURIComponent(query)}&page=${page}`);
    return response.data;
  },

  getMovieDetails: async (id: number) => {
    const response = await api.get(`/movies/${id}`);
    return response.data;
  },

  createMovieInDatabase: async (movieData: {
    id: number;
    title: string;
    poster_path: string;
    backdrop_path: string;
    overview: string;
    release_date: string;
    popularity: number;
    original_language: string;
  }) => {
    try {
      const response = await api.post('/movies/create', movieData);
      return response.data;
    } catch (error: any) {
      console.error('Error creating movie in database:', error);
      throw error;
    }
  },

  getMoviesByGenre: async (genreId: number) => {
    const response = await api.get(`/movies/genre?genre=${genreId}`);
    return response.data;
  },

  // REVIEW SERVICES
  createReview: async (data: { movieId: number; rating: number; comment: string; visibility?: 'PUBLIC' | 'PRIVATE' }) => {
    const response = await api.post('/reviews', data);
    return response.data;
  },

  getAllReviews: async () => {
    const response = await api.get('/reviews');
    return response.data;
  },

  getReviewById: async (id: number) => {
    const response = await api.get(`/reviews/${id}`);
    return response.data;
  },

  getReviewsByUserId: async (userId: number) => {
    try {
      const response = await api.get(`/reviews/user/${userId}`);
      return response.data;
    } catch (error: any) {
      console.error(`Error fetching reviews for user ${userId}:`, error);
      return [];
    }
  },

  getReviewsByMovieId: async (movieId: number) => {
    const response = await api.get(`/reviews/movie/${movieId}`);
    return response.data;
  },

  updateReview: async (id: number, data: { rating?: number; comment?: string; visibility?: 'PUBLIC' | 'PRIVATE' }) => {
    const response = await api.put(`/reviews/${id}`, data);
    return response.data;
  },

  deleteReview: async (id: number) => {
    const response = await api.delete(`/reviews/${id}`);
    return response.data;
  },

  // LIKE SERVICES
  toggleLike: async (reviewId: number) => {
    const response = await api.post(`/likes/${reviewId}/toggle`);
    return response.data;
  },

  getLikeCount: async (reviewId: number) => {
    const response = await api.get(`/likes/${reviewId}/count`);
    return response.data;
  },

  hasUserLikedReview: async (reviewId: number) => {
    const response = await api.get(`/likes/${reviewId}/status`);
    return response.data;
  },

  // COMMENT SERVICES
  createComment: async (reviewId: number, content: string) => {
    const response = await api.post(`/comments/${reviewId}`, { content });
    return response.data;
  },

  getCommentsByReviewId: async (reviewId: number) => {
    const response = await api.get(`/comments/${reviewId}`);
    return response.data;
  },

  // FOLLOW SERVICES
  followUser: async (followUserId: number) => {
    const response = await api.post('/followers/follow', { followUserId });
    return response.data;
  },

  unfollowUser: async (unfollowUserId: number) => {
    const response = await api.post('/followers/unfollow', { unfollowUserId });
    return response.data;
  },

  getFollowers: async (userId: number) => {
    try {
      const response = await api.get(`/followers/${userId}/followers`);
      return response.data.followers || [];
    } catch (error) {
      console.error('Error fetching followers:', error);
      return [];
    }
  },

  getFollowing: async (userId: number) => {
    try {
      const response = await api.get(`/followers/${userId}/following`);
      return response.data.following || [];
    } catch (error) {
      console.error('Error fetching following:', error);
      return [];
    }
  },

  // FAVORITE SERVICES
   getUserFavorites: async () => {
    const response = await api.get('/favorites');
    return response.data;
  },

  addFavorite: async (movieId: number) => {
    const response = await api.post('/favorites', { movieId });
    return response.data;
  },

  removeFavorite: async (movieId: number) => {
    const response = await api.delete(`/favorites/${movieId}`);
    return response.data;
  },

  toggleFavorite: async (movieId: number) => {
    const response = await api.post(`/favorites/${movieId}/toggle`);
    return response.data;
  },

  getFavoritesByUserId: async (userId: number) => {
    const response = await api.get(`/favorites/user/${userId}`);
    return response.data;
  },

};

export default services;
