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

export const ProfilePage: React.FC = () => {
  const { user } = useSelector((state: any) => state.login);
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadUserReviews();
  }, [user, navigate]);

  const loadUserReviews = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const userReviews = await services.getReviewsByUserId(parseInt(user.id));
      setReviews(userReviews);
    } catch (error) {
      console.error('Error loading reviews:', error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  const favoriteMovies = [
    {
      id: 1,
      title: "Us",
      poster: "https://image.tmdb.org/t/p/w300/ux2dU1jQ2ACIMShzB3yP93Udpzc.jpg",
      rating: 5,
      quote: "great movie and plot twist"
    },
    {
      id: 2,
      title: "Saltburn",
      poster: "https://image.tmdb.org/t/p/w300/qjhahNLSZ705B5JP92YMEYPocPz.jpg",
      rating: 5,
      quote: "great movie and plot twist"
    },
    {
      id: 3,
      title: "Origin",
      poster: "https://image.tmdb.org/t/p/w300/8yPSYhooj8nyBbmV3GVdLDwuE7e.jpg",
      rating: 4,
      quote: "great movie and plot twist"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0F172A] text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header do Perfil */}
        <div className="bg-gradient-to-r from-slate-700/80 to-slate-600/80 rounded-2xl p-8 mb-8 backdrop-blur-sm border border-slate-500/30">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg border-4 border-white/20">
              {user.name.charAt(0).toUpperCase()}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold text-white">{user.name}</h1>
                <button
                  onClick={() => navigate('/edit-profile')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors shadow-lg"
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
                  <span className="text-sm text-gray-300">0 Reviews</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Seção As Favoritas */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-left">As Favoritas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {favoriteMovies.map((movie) => (
              <div key={movie.id} className="bg-slate-800/50 rounded-lg p-4 backdrop-blur-sm border border-slate-600/30">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/300x450?text=No+Image';
                  }}
                />
                <div className="flex items-center gap-1 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={`text-lg ${
                        i < movie.rating ? 'text-yellow-400' : 'text-gray-600'
                      }`}
                    >
                      ★
                    </span>
                  ))}
                  <span className="ml-2 text-sm text-blue-400">PRIVADO</span>
                </div>
                <p className="text-gray-300 text-sm italic">"{movie.quote}"</p>
              </div>
            ))}
          </div>
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