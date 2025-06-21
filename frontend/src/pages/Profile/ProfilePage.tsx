import React, { useState, useEffect, useCallback } from 'react'; 
import { useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import services from '../../services/index';
import { MovieReviewModal } from '../../components/MoveReviewModal/MoveReviewModal';
import { MovieModal } from '../../components/movie/MovieModal';
import { Carousel } from '../../components/Carousel/Carousel'; // Ajuste o caminho conforme necessário

interface Review {
  id: number;
  movieId: number;
  rating: number;
  comment: string;
  createdAt: string;
  visibility?: 'PUBLIC' | 'PRIVATE';
  movie?: {
    id: number;
    title: string;
    poster_path: string;
    release_date: string;
    overview?: string;
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

interface ReviewModalData {
  id: number;
  poster: string;
  title: string;
  rating: number;
  text: string;
  details: string;
  visibility?: 'PUBLIC' | 'PRIVATE';
  movieId: number;
  overview?: string;
}

interface MovieForModal {
  id: number;
  title: string;
  year: string;
  poster: string;
  overview?: string;
}

interface CarouselItem {
  id: number;
  poster: string;
  title: string;
  rating?: number;
  text?: string;
  isFavorite?: boolean;
}

export const ProfilePage: React.FC = () => {
  const { user } = useSelector((state: any) => state.login);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState<ReviewModalData | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<MovieForModal | null>(null);
  const [unfavoriteLoading, setUnfavoriteLoading] = useState(false);

  const loadUserData = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const userId = typeof user.id === 'string' ? parseInt(user.id) : user.id;
      
      console.log('Loading data for user:', userId);
      
      const [userReviews, userFavorites] = await Promise.all([
        services.getReviewsByUserId(userId).catch(err => {
          console.error('Error loading reviews:', err);
          return [];
        }),
        services.getUserFavorites().catch(err => {
          console.error('Error loading favorites:', err);
          return [];
        })
      ]);
      
      console.log('Loaded reviews:', userReviews.length);
      console.log('Loaded favorites:', userFavorites.length);
      
      setReviews(Array.isArray(userReviews) ? userReviews : []);
      setFavorites(Array.isArray(userFavorites) ? userFavorites : []);
    } catch (error) {
      console.error('Error loading user data:', error);
      setReviews([]);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadUserData();
  }, [user, navigate, loadUserData]);

  useEffect(() => {
    const movieId = searchParams.get('movieId');
    if (movieId && favorites.length > 0) {
      const favorite = favorites.find(f => f.movieId.toString() === movieId);
      if (favorite) {
        const movieForModal: MovieForModal = {
          id: favorite.movie.id,
          title: favorite.movie.title,
          year: favorite.movie.release_date ? new Date(favorite.movie.release_date).getFullYear().toString() : '',
          poster: `https://image.tmdb.org/t/p/w342${favorite.movie.poster_path}`
        };
        setSelectedMovie(movieForModal);
      }
    }
  }, [searchParams, favorites]);

  const favoritesCarouselItems: CarouselItem[] = favorites.map(favorite => ({
    id: favorite.movie.id,
    poster: `https://image.tmdb.org/t/p/w342${favorite.movie.poster_path}`,
    title: favorite.movie.title,
    rating: undefined, // Favoritos não têm rating, meio que seila da pra por se tiver review
    text: favorite.movie.release_date ? new Date(favorite.movie.release_date).getFullYear().toString() : '',
    isFavorite: true
  }));

  const reviewsCarouselItems: CarouselItem[] = reviews
    .filter(review => review.movie)
    .map(review => ({
      id: review.movie!.id,
      poster: `https://image.tmdb.org/t/p/w342${review.movie!.poster_path}`,
      title: review.movie!.title,
      rating: review.rating,
      text: review.comment.length > 50 ? review.comment.substring(0, 50) + '...' : review.comment,
      isFavorite: false
    }));

  const handleCreateReview = () => {
    navigate('/movies');
  };

  const handleReviewClick = (review: Review) => {
    if (review.movie) {
      const reviewData: ReviewModalData = {
        id: review.id,
        poster: `https://image.tmdb.org/t/p/w300${review.movie.poster_path}`,
        title: review.movie.title,
        rating: review.rating,
        text: review.comment,
        visibility: review["visibility"] ?? 'PUBLIC',
        details: `Avaliado em ${new Date(review.createdAt).toLocaleDateString('pt-BR')} • ${review.movie.release_date ? new Date(review.movie.release_date).getFullYear() : 'Ano não disponível'}`,
        movieId: review.movieId,
        overview: review.movie?.overview,
      };
      setSelectedReview(reviewData);
    }
  };

  const handleFavoriteClick = (favorite: Favorite) => {
    const movieForModal: MovieForModal = {
      id: favorite.movie.id,
      title: favorite.movie.title,
      year: favorite.movie.release_date ? new Date(favorite.movie.release_date).getFullYear().toString() : '',
      poster: `https://image.tmdb.org/t/p/w342${favorite.movie.poster_path}`
    };
    setSelectedMovie(movieForModal);
    setSearchParams({ movieId: favorite.movieId.toString() });
  };

  const handleCloseMovieModal = () => {
    setSelectedMovie(null);
    setSearchParams({});
  };

  const handleUnfavorite = async (movie: MovieForModal) => {
    if (unfavoriteLoading) return;
    
    try {
      setUnfavoriteLoading(true);
      
      const result = await services.toggleFavorite(movie.id);
      console.log('Filme removido dos favoritos!');
      
      setFavorites(prev => prev.filter(fav => fav.movieId !== movie.id));
      
      handleCloseMovieModal();
      
    } catch (error) {
      console.error('Error unfavoriting movie:', error);
      loadUserData();
    } finally {
      setUnfavoriteLoading(false);
    }
  };

  const handleRate = (movie: MovieForModal) => {
    navigate("/rate", { state: { movie } });
  };

  const closeReviewModal = () => {
    setSelectedReview(null);
  };

  const handleViewMovieFromModal = () => {
    if (selectedReview) {
      navigate(`/movie/${selectedReview.movieId}`);
      setSelectedReview(null);
    }
  };

  const handleFavoriteCarouselSelect = (item: CarouselItem) => {
    const favorite = favorites.find(f => f.movie.id === item.id);
    if (favorite) {
      handleFavoriteClick(favorite);
    }
  };

  const handleReviewCarouselSelect = (item: CarouselItem) => {
    const review = reviews.find(r => r.movie && r.movie.id === item.id);
    if (review) {
      handleReviewClick(review);
    }
  };

  if (!user) {
    return null;
  }

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

        {/* Carousel de Favoritos */}
        {loading ? (
          <div className="text-center py-8">
            <div className="text-gray-400">Carregando favoritos...</div>
          </div>
        ) : favoritesCarouselItems.length > 0 ? (
          <Carousel
            items={favoritesCarouselItems}
            onSelect={handleFavoriteCarouselSelect}
            title="Meus Filmes Favoritos"
            type="favorites"
          />
        ) : (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">Meus Filmes Favoritos</h2>
            <div className="text-center py-8">
              <p className="text-gray-400 text-lg">Você ainda não tem filmes favoritos</p>
              <button
                onClick={() => navigate('/movies')}
                className="mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                Explorar Filmes
              </button>
            </div>
          </div>
        )}

        {/* Carousel de Reviews */}
        {loading ? (
          <div className="text-center py-8">
            <div className="text-gray-400">Carregando reviews...</div>
          </div>
        ) : reviewsCarouselItems.length > 0 ? (
          <Carousel
            items={reviewsCarouselItems}
            onSelect={handleReviewCarouselSelect}
            title="Minhas Reviews"
            type="reviews"
          />
        ) : (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">Minhas Reviews</h2>
            <div className="text-center py-8">
              <p className="text-gray-400 text-lg">Você ainda não escreveu nenhuma review</p>
              <button
                onClick={() => navigate('/movies')}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                Explorar Filmes
              </button>
            </div>
          </div>
        )}
      </div>

      {selectedReview && (
        <MovieReviewModal
          review={selectedReview}
          onClose={closeReviewModal}
          onViewMovie={handleViewMovieFromModal}
          onEdit={() => {
            navigate('/edit-rate', {
              state: {
                movie: {
                  id: selectedReview.movieId,
                  title: selectedReview.title,
                  poster: selectedReview.poster,
                  year: selectedReview.details.split('•')[1]?.trim() ?? ''
                },
                review: {
                  id: selectedReview.id,
                  rating: selectedReview.rating,
                  comment: selectedReview.text,
                  visibility: selectedReview.visibility ?? 'PUBLIC'
                }
              }
            });
            closeReviewModal();
          }}
          onDelete={async () => {
            const confirmed = window.confirm("Tem certeza que deseja deletar essa review?");
            if (confirmed) {
              try {
                await services.deleteReview(selectedReview.id);
                setReviews(prev => prev.filter(r => r.id !== selectedReview.id));
                closeReviewModal();
              } catch (error) {
                alert("Erro ao deletar review");
                console.error(error);
              }
            }
          }}
        />
      )}

      {/* Modal de Filme Favorito */}
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          actions={[
            {
              label: "Avaliar",
              onClick: () => handleRate(selectedMovie),
            },
            { 
              label: unfavoriteLoading ? "Removendo..." : "Desfavoritar", 
              onClick: () => handleUnfavorite(selectedMovie),
              disabled: unfavoriteLoading
            },
          ]}
          onClose={handleCloseMovieModal}
        />
      )}
    </div>
  );
};