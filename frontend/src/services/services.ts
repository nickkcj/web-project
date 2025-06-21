import axios from "axios";
import { PATH } from "../path";

// Create axios instance with default config
const api = axios.create({
  baseURL: PATH.base,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
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
  // ===== USER SERVICES =====
  registerUser: async (body: { name: string; email: string; password: string }) => {
    try {
      const response = await api.post('/users', {
        name: body.name,
        email: body.email,
        password: body.password,
      });
      return response.data;
    } catch (err: any) {
      if (err.response) {
        if (err.response.data && Array.isArray(err.response.data)) {
          const errorMessage = err.response.data[0];
          if (errorMessage === "This email is already in use.") {
            throw new Error("Este e-mail já está em uso.");
          } else {
            throw new Error(errorMessage);
          }
        } else {
          throw new Error("Erro inesperado. Tente novamente.");
        }
      } else {
        throw new Error("Um erro ocorreu. Tente novamente mais tarde.");
      }
    }
  },

  loginUser: async (body: { email: string; password: string }) => {
    try {
      const response = await api.post('/users/login', {
        email: body.email,
        password: body.password,
      });
      return response.data;
    } catch (err: any) {
      if (err.response?.status === 401) {
        throw new Error("Credenciais inválidas.");
      }
      throw new Error("Erro ao tentar fazer login.");
    }
  },

  getUserProfile: async () => {
    try {
      const response = await api.get('/users/me');
      return response.data;
    } catch (error) {
      throw new Error('Erro ao buscar perfil do usuário');
    }
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

  // ===== MOVIE SERVICES =====
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

  // ===== REVIEW SERVICES =====
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
      console.error(`Error fetching reviews for user ${userId}:`, {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: `/reviews/user/${userId}`,
        userId
      });
      
      if (error.response?.status === 500) {
        console.error(`Server error when fetching reviews for user ${userId}. This could indicate:
          - User doesn't exist in database
          - Database connection issues
          - Backend query problems
          - User has corrupted data
        `);
      }
      
      // Return empty array instead of throwing to prevent UI crashes
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

  // ===== LIKE SERVICES =====
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

  // ===== COMMENT SERVICES =====
  createComment: async (reviewId: number, content: string) => {
    const response = await api.post(`/comments/${reviewId}`, { content });
    return response.data;
  },

  getCommentsByReviewId: async (reviewId: number) => {
    const response = await api.get(`/comments/${reviewId}`);
    return response.data;
  },

  // ===== FOLLOW SERVICES =====
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
      const response = await api.post('/followers/get-followers', { userId });
      return response.data.followers || [];
    } catch (error) {
      console.error('Error fetching followers:', error);
      return [];
    }
  },

  getFollowing: async (userId: number) => {
    try {
      const response = await api.post('/followers/get-following', { userId });
      return response.data.following || [];
    } catch (error) {
      console.error('Error fetching following:', error);
      return [];
    }
  },

  // ===== FAVORITE SERVICES =====
  toggleFavorite: async (movieId: number) => {
    const response = await api.post(`/favorites/${movieId}/toggle`);
    return response.data;
  },

  getUserFavorites: async () => {
    const response = await api.get('/favorites');
    return response.data;
  },

  hasUserFavorited: async (movieId: number) => {
    const response = await api.get(`/favorites/${movieId}/status`);
    return response.data;
  },

  // Helper to create movie in database when favoriting
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
    const response = await api.post('/movies/create', movieData);
    return response.data;
  },
};

export default services;