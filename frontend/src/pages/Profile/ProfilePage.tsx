import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import services from '../../services/services';

interface Review {
  id: number;
  movieId: number;
  rating: number;
  comment: string;
  createdAt: string;
  movie?: {
    id: number;
    title: string;
    poster_path: string;
    release_date: string;
  };
}

interface Favorite {
  id: number;
  userId: number;
  movieId: number;
  createdAt: string;
  movie: {
    id: number;
    title: string;
    poster_path: string;
    backdrop_path: string;
    overview: string;
    release_date: string;
    popularity: number;
    original_language: string;
  };
}

export const ProfilePage: React.FC = () => {
  const { user } = useSelector((state: any) => state.login);
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadUserData();
  }, [user, navigate]);

  const loadUserData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const userId = typeof user.id === 'string' ? parseInt(user.id) : user.id;
      
      // Load reviews and favorites in parallel
      const [userReviews, userFavorites] = await Promise.all([
        services.getReviewsByUserId(userId),
        services.getUserFavorites()
      ]);
      
      setReviews(Array.isArray(userReviews) ? userReviews : []);
      setFavorites(Array.isArray(userFavorites) ? userFavorites : []);
    } catch (error) {
      console.error('Error loading user data:', error);
      setReviews([]);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReview = () => {
    navigate('/movies');
  };

  if (!user) {
    return null;
  }

  // Get top 3 favorites for display
  const topFavorites = favorites.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#0F172A] text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-slate-700/80 to-slate-600/80 rounded-2xl p-8 mb-8 backdrop-blur-sm border border-slate-500/30">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg border-4 border-white/20">
              {user.name.charAt(0).toUpperCase()}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold text-white">{user.name}</h1>
                <button 
                  onClick={handleCreateReview}
                  className="bg-[#1C354E] hover:bg-[#172B3F] text-white px-6 py-2 rounded-full font-normal transition-colors shadow-md"
                >
                  Criar Review
                </button>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400">⭐</span>
                  <span className="text-sm text-gray-300">5 Estrelas</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-400">👥</span>
                  <span className="text-sm text-gray-300">{reviews.length} Reviews</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-400">❤️</span>
                  <span className="text-sm text-gray-300">{favorites.length} Favoritos</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Seção As Favoritas */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-left">As Favoritas</h2>
          {loading ? (
            <div className="text-center py-8">
              <div className="text-gray-400">Carregando favoritos...</div>
            </div>
          ) : topFavorites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {topFavorites.map((favorite) => {
                // Find review for this movie to get rating and quote
                const movieReview = reviews.find(r => r.movieId === favorite.movieId);
                
                return (
                  <div key={favorite.id} className="bg-slate-800/50 rounded-lg p-4 backdrop-blur-sm border border-slate-600/30">
                    <img
                      src={`https://image.tmdb.org/t/p/w300${favorite.movie.poster_path}`}
                      alt={favorite.movie.title}
                      className="w-full h-64 object-cover rounded-lg mb-4"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/300x450?text=No+Image';
                      }}
                    />
                    <div className="flex items-center gap-1 mb-2">
                      {movieReview ? (
                        Array.from({ length: 5 }).map((_, i) => (
                          <span
                            key={i}
                            className={`text-lg ${
                              i < movieReview.rating ? 'text-yellow-400' : 'text-gray-600'
                            }`}
                          >
                            ★
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400 text-sm">Sem avaliação</span>
                      )}
                      <span className="ml-2 text-sm text-blue-400">FAVORITO</span>
                    </div>
                    <h3 className="text-white font-semibold mb-2">{favorite.movie.title}</h3>
                    <p className="text-gray-300 text-sm italic">
                      {movieReview ? `"${movieReview.comment.substring(0, 50)}..."` : '"Filme favoritado"'}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400 text-lg">Você ainda não tem filmes favoritos</p>
              <button
                onClick={() => navigate('/movies')}
                className="mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                Explorar Filmes
              </button>
            </div>
          )}
        </div>

        {/* Seção Todas as Reviews */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-left">Todas as Reviews</h2>
          {loading ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg">Carregando reviews...</div>
            </div>
          ) : reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((review) => (
                <div key={review.id} className="bg-slate-800/50 rounded-lg p-4 backdrop-blur-sm border border-slate-600/30">
                  <div className="flex gap-4">
                    {review.movie && (
                      <img
                        src={`https://image.tmdb.org/t/p/w200${review.movie.poster_path}`}
                        alt={review.movie.title}
                        className="w-16 h-24 object-cover rounded"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/200x300?text=No+Image';
                        }}
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span
                            key={i}
                            className={`text-lg ${
                              i < review.rating ? 'text-yellow-400' : 'text-gray-600'
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      {review.movie && (
                        <h3 className="text-white font-semibold text-sm mb-1 truncate">
                          {review.movie.title}
                        </h3>
                      )}
                      <p className="text-gray-300 text-xs line-clamp-3 mb-2">
                        {review.comment}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {new Date(review.createdAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">Você ainda não escreveu nenhuma review</p>
              <button
                onClick={() => navigate('/movies')}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                Explorar Filmes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};