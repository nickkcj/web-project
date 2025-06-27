import React, { useState, useEffect, useCallback } from 'react'; 
import { useSelector } from 'react-redux';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import services from '../../services/index';
import { MovieReviewModal } from '../../components/MoveReviewModal/MoveReviewModal';
import { MovieModal } from '../../components/Movie/MovieModal';
import { Carousel } from '../../components/Carousel/Carousel';
import { Users, UserCheck, Star, SquarePen  } from "lucide-react";

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
  const { user: loggedUser } = useSelector((state: any) => state.login);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { id: paramId } = useParams();
  const [profileUser, setProfileUser] = useState<any>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState<ReviewModalData | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<MovieForModal | null>(null);
  const [unfavoriteLoading, setUnfavoriteLoading] = useState(false);
  const [followed, setFollowed] = useState(false);

  // Carrega dados do usuário do perfil (logado ou outro)
  const loadUserData = useCallback(async () => {
    setLoading(true);
    try {
      let userData;
      let userId;
      if (paramId) {
        userData = await services.getUserById(Number(paramId));
        userId = Number(paramId);
      } else {
        userData = loggedUser;
        userId = typeof loggedUser.id === 'string' ? parseInt(loggedUser.id) : loggedUser.id;
      }
      setProfileUser(userData);
      // Busca reviews e favoritos do usuário do perfil
      const [userReviews, userFavorites] = await Promise.all([
        services.getReviewsByUserId(userId).catch(() => []),
        userId === loggedUser.id
          ? services.getUserFavorites().catch(() => [])
          : services.getFavoritesByUserId(userId).catch(() => [])
      ]);
      setReviews(Array.isArray(userReviews) ? userReviews : []);
      setFavorites(Array.isArray(userFavorites) ? userFavorites : []);
      // Verifica se o usuário logado já segue este perfil
      if (loggedUser && userId !== loggedUser.id) {
        const following = await services.getFollowing(loggedUser.id);
        const ids = following.map((u: any) => u.followingId ?? u.following?.id).filter(Boolean);
        setFollowed(ids.includes(userId));
      }
    } catch (error) {
      setProfileUser(null);
      setReviews([]);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }, [paramId, loggedUser]);

  useEffect(() => {
    if (!loggedUser) {
      navigate('/login');
      return;
    }
    loadUserData();
  }, [loggedUser, navigate, loadUserData]);

  useEffect(() => {
    const movieIdStr = searchParams.get('movieId');
    if (!movieIdStr) {
      setSelectedMovie(null);
      return;
    }

    const movieId = parseInt(movieIdStr);
    if (isNaN(movieId)) {
      setSelectedMovie(null);
      return;
    }

    if (selectedMovie?.id === movieId) return;

    services.getMovieDetails(movieId)
      .then(movie => {
        const movieForModal: MovieForModal = {
          id: movie.id,
          title: movie.title,
          year: movie.release_date ? new Date(movie.release_date).getFullYear().toString() : '',
          poster: `https://image.tmdb.org/t/p/w342${movie.poster_path}`,
          overview: movie.overview,
        };
        setSelectedMovie(movieForModal);
      })
      .catch(err => {
        console.error('Erro ao buscar detalhes do filme:', err);
        setSelectedMovie(null);
      });
  }, [searchParams, selectedMovie]);


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

  // Seguir/Deixar de seguir
  const handleFollow = async () => {
    if (!profileUser) return;
    await services.followUser(profileUser.id);
    setFollowed(true);
  };
  const handleUnfollow = async () => {
    if (!profileUser) return;
    await services.unfollowUser(profileUser.id);
    setFollowed(false);
  };

  // Determina se é o próprio perfil ou de outro usuário
  const isOwnProfile = !paramId || Number(paramId) === loggedUser.id;

  if (!profileUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-slate-700/80 to-slate-600/80 rounded-2xl p-8 mb-8 backdrop-blur-sm border border-slate-500/30">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg border-4 border-white/20">
              {profileUser.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold text-white">{profileUser.name}</h1>
                {isOwnProfile ? (
                  <button 
                    onClick={handleCreateReview}
                    className="bg-[#1C354E] hover:bg-[#172B3F] text-white px-6 py-2 rounded-full font-normal transition-colors shadow-md"
                  >
                    Criar Review
                  </button>
                ) : (
                  <button
                    onClick={followed ? handleUnfollow : handleFollow}
                    className={`px-4 py-2 rounded-full font-normal transition-colors shadow-md text-white text-s ${followed ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                  >
                    {followed ? <span className="block leading-tight">Deixar<br/>de seguir</span> : "Seguir"}
                  </button>
                )}
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <UserCheck className="text-blue-400 w-5 h-5" />
                  <span className="text-sm text-gray-300">Seguindo</span>
                  <span className="text-sm text-gray-300">{profileUser.followingCount ?? 0}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="text-green-400 w-5 h-5" />
                  <span className="text-sm text-gray-300">Seguidores</span>
                  <span className="text-sm text-gray-300">{profileUser.followersCount ?? 0}</span>
                </div>
                <div className="flex items-center gap-2">
                  <SquarePen  className="text-yellow-200 w-5 h-5" />
                  <span className="text-sm text-gray-300">{reviews.length} Reviews</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="text-yellow-700 w-5 h-5" />
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
            title={isOwnProfile ? "Meus Filmes Favoritos" : "Filmes Favoritos"}
            type="favorites"
          />
        ) : (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">{isOwnProfile ? "Meus Filmes Favoritos" : "Filmes Favoritos"}</h2>
            <div className="text-center py-8">
              <p className="text-gray-400 text-lg">{isOwnProfile ? "Você ainda não tem filmes favoritos" : "Esse usuário ainda não fez nenhum registro"}</p>
              {isOwnProfile && (
                <button
                  onClick={() => navigate('/movies')}
                  className="mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                >
                  Explorar Filmes
                </button>
              )}
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
            title={isOwnProfile ? "Minhas Reviews" : "Reviews"}
            type="reviews"
          />
        ) : (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">{isOwnProfile ? "Minhas Reviews" : "Reviews"}</h2>
            <div className="text-center py-8">
              <p className="text-gray-400 text-lg">{isOwnProfile ? "Você ainda não escreveu nenhuma review" : "Esse usuário ainda não fez nenhum registro"}</p>
              {isOwnProfile && (
                <button
                  onClick={() => navigate('/movies')}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                >
                  Explorar Filmes
                </button>
              )}
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