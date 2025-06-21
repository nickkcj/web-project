import axios from "axios";
import { PATH} from "../path";

// Create axios instance with default config
const api = axios.create({
  baseURL: PATH.base,
  headers: {
    'Content-Type': 'application/json',
  },
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
    if (error.response?.status === 401) {
      // Only redirect to login if we're not already on login/register pages
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/login') && !currentPath.includes('/register')) {
        localStorage.removeItem('authToken');
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

  updateUserProfile: async (data: { name?: string; email?: string }) => {
    const response = await api.put('/users/me', data);
    return response.data;
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
    const response = await api.get(`/reviews/user/${userId}`);
    return response.data;
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
    const response = await api.get(`/followers/followers/${userId}`);
    return response.data.followers || [];
  },

  getFollowing: async (userId: number) => {
    const response = await api.get(`/followers/following/${userId}`);
    return response.data.following || [];
  },
};

export default services;