import React, { useEffect, useState } from 'react';
import services from '../../services';
import { Carousel } from '../Carousel/Carousel';
import { MovieModal } from '../Movie/MovieModal';
import { useSelector } from 'react-redux';

export const FeaturedSection: React.FC = () => {
  const [trending, setTrending] = useState<any[]>([]);
  const [userFavorites, setUserFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLogged, setIsLogged] = useState(false);
  const { user } = useSelector((state: any) => state.login);
  const [selectedMovie, setSelectedMovie] = useState<any | null>(null);
  const [movieDetails, setMovieDetails] = useState<any | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsLogged(!!token);
    setLoading(true);

    services.getPopularMovies()
      .then((data) => {
        setTrending((data?.results || data || []).slice(0, 12));
      })
      .catch(() => setTrending([]));

    if (token) {
      services.getUserFavorites()
        .then((data) => {
          setUserFavorites((data || []).slice(0, 12));
        })
        .catch(() => setUserFavorites([]))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const trendingItems = trending.map((m: any) => ({
    id: m.id,
    poster: m.poster_path ? `https://image.tmdb.org/t/p/w300${m.poster_path}` : '',
    title: m.title || m.name || 'Filme',
  }));
  
  const userFavoriteItems = userFavorites
    .filter((fav: any) => fav.movie)
    .map((fav: any) => ({
      id: fav.movie.id,
      poster: fav.movie.poster_path ? `https://image.tmdb.org/t/p/w300${fav.movie.poster_path}` : '',
      title: fav.movie.title,
      isFavorite: true,
    }));

  const handleSelectMovie = async (item: any) => {
    setModalLoading(true);
    setSelectedMovie(item);
    try {
      const details = await services.getMovieDetails(item.id);
      setMovieDetails(details);
      if (user) {
        const favs = await services.getUserFavorites();
        setIsFavorite(favs.some((f: any) => f.movieId === item.id || f.movie?.id === item.id));
      } else {
        setIsFavorite(false);
      }
    } catch {
      setMovieDetails(null);
    } finally {
      setModalLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!user || !movieDetails) return;
    setModalLoading(true);
    try {
      const result = await services.toggleFavorite(movieDetails.id);
      setIsFavorite(result.favorited ?? !isFavorite);
    } catch {}
    setModalLoading(false);
  };

  const handleReview = () => {
    if (!user || !movieDetails) return;
    window.location.href = `/movie/${movieDetails.id}/review`;
  };

  if (loading) return (
    <section className="mb-[60px] flex flex-col items-center justify-center min-h-[200px]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
        <span className="text-slate-300 text-lg">Carregando filmes em destaque...</span>
      </div>
    </section>
  );

  return (
    <section className="mb-[60px]">
      {isLogged && (
        <>
          <div>
            <Carousel
              items={userFavoriteItems}
              onSelect={handleSelectMovie}
              title="Seus Favoritos"
              type="favorites"
              itemSize="small"
            />
          </div>
        </>
      )}
      <div className="mb-10">
        <Carousel
          items={trendingItems}
          onSelect={handleSelectMovie}
          title="Trending Movies"
          type="favorites"
          itemSize="small"
        />
      </div>
      {selectedMovie && (
        <MovieModal
          movie={movieDetails ? {
            id: movieDetails.id,
            title: movieDetails.title,
            year: movieDetails.release_date?.slice(0, 4) ?? '',
            poster: movieDetails.poster_path ? `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}` : '',
            overview: movieDetails.overview,
          } : undefined}
          loading={!movieDetails}
          onClose={() => {
            setSelectedMovie(null);
            setMovieDetails(null);
          }}
          actions={user && movieDetails ? [
            {
              label: isFavorite ? 'Unfavorite' : 'Favorite',
              onClick: handleToggleFavorite,
              disabled: false,
            },
            {
              label: 'Write Review',
              onClick: handleReview,
              disabled: false,
            },
          ] : []}
        />
      )}
    </section>
  );
};