import React, { useEffect, useState } from 'react';
import services from '../../services';
import { Carousel } from '../Carousel/Carousel';
import { ReviewsSection } from './ReviewsSection';

export const FeaturedSection: React.FC = () => {
  const [trending, setTrending] = useState<any[]>([]);
  const [globalFavorites, setGlobalFavorites] = useState<any[]>([]);
  const [userFavorites, setUserFavorites] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsLogged(!!token);
    setLoading(true);

    services.getPopularMovies(1)
      .then((data) => {
        setTrending((data?.results || data || []).slice(0, 12));
      })
      .catch(() => setTrending([]));

    services.getPopularMovies(2)
      .then((data) => {
        setGlobalFavorites((data?.results || data || []).slice(0, 12));
      })
      .catch(() => setGlobalFavorites([]));

    services.getAllReviews()
      .then((data) => {
        setReviews((data || []).slice(0, 12));
      })
      .catch(() => setReviews([]));

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

  const globalFavoriteItems = globalFavorites.map((m: any) => ({
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

  const reviewItems = reviews.map((r: any) => ({
    id: r.id,
    poster: r.poster_path ? `https://image.tmdb.org/t/p/w300${r.poster_path}` : (r.posterUrl || ''),
    title: r.title || r.movieTitle || 'Filme',
    rating: r.rating,
    text: r.comment || r.text,
  }));

  if (loading) return null;

  return (
    <section className="mb-[60px]">
      {isLogged && (
        <>
          <div className="mb-[60px]">
            <ReviewsSection />
          </div>
          <div>
            <Carousel
              items={userFavoriteItems}
              onSelect={() => {}}
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
          onSelect={() => {}}
          title="Trending Movies"
          type="favorites"
          itemSize="small"
        />
        <Carousel
          items={globalFavoriteItems}
          onSelect={() => {}}
          title="Favoritos de Todos os Tempos"
          type="favorites"
          itemSize="small"
        />
      </div>
    </section>
  );
};