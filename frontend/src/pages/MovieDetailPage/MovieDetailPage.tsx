import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import services from '../../services/index';
import { Star, Heart, HeartOff, PenSquare, ChevronLeft } from 'lucide-react';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  release_date: string;
  popularity: number;
  original_language: string;
  vote_average: number;
  vote_count: number;
  genres?: Array<{ id: number; name: string }>;
  runtime?: number;
}

interface Review {
  id: number;
  movieId: number;
  rating: number;
  comment: string;
  createdAt: string;
  user?: {
    id: number;
    name: string;
  };
  userId?: number;
}

export const MovieDetailPage: React.FC = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const navigate = useNavigate();
  const { user } = useSelector((state: any) => state.login);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [allReviews, setAllReviews] = useState<Review[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (movieId) {
      loadMovieData();
    }
  }, [movieId]);

  const loadMovieData = async () => {
    if (!movieId) return;

    try {
      setLoading(true);
      setError(null);

      const movieIdNum = parseInt(movieId);

      const [movieData, movieReviews, userFavorites] = await Promise.all([
        services.getMovieDetails(movieIdNum).catch(() => null),
        services.getReviewsByMovieId(movieIdNum).catch(() => []),
        user ? loadUserFavorites().catch(() => []) : Promise.resolve([])
      ]);

      if (!movieData) {
        setError('Filme não encontrado');
        return;
      }

      setMovie(movieData);
      setAllReviews(Array.isArray(movieReviews) ? movieReviews : []);

      if (user && Array.isArray(userFavorites)) {
        setIsFavorite(userFavorites.some(fav => fav.movieId === movieIdNum));
      }

      if (user && Array.isArray(movieReviews)) {
        const currentUserReview = movieReviews.find(review =>
          review.user?.id === user.id || review.userId === user.id
        );
        setUserReview(currentUserReview || null);
      }

    } catch (error) {
      console.error('Error loading movie data:', error);
      setError('Erro ao carregar dados do filme');
    } finally {
      setLoading(false);
    }
  };

  const loadUserFavorites = async () => {
    try {
      if ('getUserFavorites' in services) {
        return await (services as any).getUserFavorites();
      }
      return [];
    } catch (error) {
      console.warn('getUserFavorites not available:', error);
      return [];
    }
  };

  const handleToggleFavorite = async () => {
    if (!user || !movie) return;

    try {
      if ('toggleFavorite' in services) {
        const result = await (services as any).toggleFavorite(movie.id);
        setIsFavorite(result.favorited);
      } else {
        if (isFavorite) {
          if ('removeFavorite' in services) {
            await (services as any).removeFavorite(movie.id);
            setIsFavorite(false);
          }
        } else {
          if ('addFavorite' in services) {
            await (services as any).addFavorite(movie.id);
            setIsFavorite(true);
          }
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleCreateReview = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate(`/movie/${movieId}/review`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F172A] text-white flex items-center justify-center">
        <div className="text-gray-400 text-lg">Carregando filme...</div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-[#0F172A] text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-4">{error || 'Filme não encontrado'}</p>
          <button
            onClick={() => navigate('/discovery')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            Voltar aos Filmes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-white">
      <div
        className="relative h-96 bg-cover bg-center"
        style={{
          backgroundImage: movie.backdrop_path
            ? `url(https://image.tmdb.org/t/p/w1280${movie.backdrop_path})`
            : 'linear-gradient(135deg, #1e293b, #334155)'
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-6xl mx-auto">
            <button
              onClick={() => navigate(-1)}
              className="mb-4 text-white/80 hover:text-white flex items-center gap-2"
            >
              <ChevronLeft size={20} /> Voltar
            </button>
            <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
            <p className="text-lg text-gray-300">
              {movie.release_date ? new Date(movie.release_date).getFullYear() : 'Ano não disponível'} •
              {movie.runtime ? ` ${movie.runtime} min` : ''} •
              <Star className="inline-block w-5 h-5 text-yellow-400 mr-1" /> {movie.vote_average?.toFixed(1)} ({movie.vote_count} votos)
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-full rounded-lg shadow-lg mb-6"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/500x750?text=No+Image';
              }}
            />

            {user && (
              <div className="space-y-3">
                <button
                  onClick={handleToggleFavorite}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                    isFavorite
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-gray-700 hover:bg-gray-600 text-white'
                  }`}
                >
                  {isFavorite ? <HeartOff size={20} /> : <Heart size={20} />}
                  {isFavorite ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
                </button>

                {!userReview && (
                  <button
                    onClick={handleCreateReview}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <PenSquare size={20} /> Escrever Review
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="lg:col-span-2">
            <div className="bg-slate-800/50 rounded-lg p-6 backdrop-blur-sm border border-slate-600/30 mb-8">
              <h2 className="text-2xl font-bold mb-4">Sinopse</h2>
              <p className="text-gray-300 leading-relaxed">
                {movie.overview || 'Sinopse não disponível.'}
              </p>

              {movie.genres && movie.genres.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">Gêneros</h3>
                  <div className="flex flex-wrap gap-2">
                    {movie.genres.map((genre) => (
                      <span
                        key={genre.id}
                        className="bg-slate-700 text-sm px-3 py-1 rounded-full"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {userReview && (
              <div className="bg-slate-800/50 rounded-lg p-6 backdrop-blur-sm border border-slate-600/30 mb-8">
                <h2 className="text-2xl font-bold mb-4">Sua Review</h2>
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className={`${
                        i < userReview.rating ? 'text-yellow-400' : 'text-gray-600'
                      }`}
                      fill={i < userReview.rating ? 'currentColor' : 'none'}
                    />
                  ))}
                </div>
                <p className="text-gray-300 mb-2">"{userReview.comment}"</p>
                <p className="text-sm text-gray-500">
                  Avaliado em {new Date(userReview.createdAt).toLocaleDateString('pt-BR')}
                </p>
              </div>
            )}

            {allReviews.length > 0 && (
              <div className="bg-slate-800/50 rounded-lg p-6 backdrop-blur-sm border border-slate-600/30">
                <h2 className="text-2xl font-bold mb-4">
                  Reviews ({allReviews.length})
                </h2>
                <div className="space-y-4">
                  {allReviews
                    .filter(review => review.id !== userReview?.id)
                    .slice(0, 5)
                    .map((review) => (
                      <div key={review.id} className="border-b border-slate-600 pb-4 last:border-b-0">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold">
                            {review.user?.name || 'Usuário Anônimo'}
                          </span>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                size={16}
                                className={`${
                                  i < review.rating ? 'text-yellow-400' : 'text-gray-600'
                                }`}
                                fill={i < review.rating ? 'currentColor' : 'none'}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-300 text-sm mb-1">"{review.comment}"</p>
                        <p className="text-xs text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};