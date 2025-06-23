import { FC, useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Movie } from "./MoviesPage";
import { MovieModal} from "../../components/Movie/MovieModal";
import services from "../../services/index";

interface Props {
  movies: Movie[];
}

const MovieGrid: FC<Props> = ({ movies }) => {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [favoriteStates, setFavoriteStates] = useState<Record<number, boolean>>({});
  const [loadingFavorites, setLoadingFavorites] = useState<Record<number, boolean>>({});
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    loadFavoriteStates();
  }, [movies]);

  useEffect(() => {
    const movieId = searchParams.get('movieId');
    if (movieId && movies.length > 0) {
      const movie = movies.find(m => m.id.toString() === movieId);
      if (movie) {
        setSelectedMovie(movie);
      }
    }
  }, [searchParams, movies]);

  const loadFavoriteStates = async () => {
    try {
      const favorites = await services.getUserFavorites();
      const favoriteIds = favorites.map((fav: any) => fav.movieId);

      const states: Record<number, boolean> = {};
      movies.forEach(movie => {
        states[movie.id] = favoriteIds.includes(movie.id);
      });

      setFavoriteStates(states);
    } catch (error) {
      console.error('Error loading favorite states:', error);
    }
  };

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
    setSearchParams({ movieId: movie.id.toString() });
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
    setSearchParams({});
  };

  const handleFavorite = async (movie: Movie) => {
    if (loadingFavorites[movie.id]) return;

    try {
      setLoadingFavorites(prev => ({ ...prev, [movie.id]: true }));

      await services.createMovieInDatabase({
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster.replace('https://image.tmdb.org/t/p/w342', ''),
        backdrop_path: '',
        overview: '',
        release_date: movie.year + '-01-01',
        popularity: 0,
        original_language: 'en'
      });

      const result = await services.toggleFavorite(movie.id);

      setFavoriteStates(prev => ({
        ...prev,
        [movie.id]: result.favorited
      }));

      console.log(result.favorited ? 'Filme favoritado!' : 'Filme removido dos favoritos!');
    } catch (error) {
      console.error('Error toggling favorite:', error);
      loadFavoriteStates();
    } finally {
      setLoadingFavorites(prev => ({ ...prev, [movie.id]: false }));
    }
  };

  const handleRate = (movie: Movie) => {
    navigate("/rate", { state: { movie } });
  };

  return (
    <>
      <div className="mt-12 flex flex-wrap justify-center gap-8 px-4">
        {movies.map((m) => (
          <div
            key={m.id}
            className="relative flex flex-col items-center w-36 cursor-pointer"
            onClick={() => handleMovieClick(m)}
          >
            {m.tag && (
              <span className="absolute top-2 right-2 bg-slate-900/80 text-[10px] px-1 rounded">
                {m.tag}
              </span>
            )}

            <img
              src={m.poster}
              alt={m.title}
              className="w-full h-52 object-cover rounded-md hover:brightness-110 transition"
            />

            <p className="mt-2 text-sm text-slate-200 text-center truncate w-full">
              {m.title}
            </p>
            <p className="text-xs text-slate-400">{m.year}</p>
          </div>
        ))}
      </div>

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          actions={[
            {
              label: "Avaliar",
              onClick: () => handleRate(selectedMovie),
            },
            {
              label: loadingFavorites[selectedMovie.id]
                ? "Carregando..."
                : favoriteStates[selectedMovie.id]
                  ? "Desfavoritar"
                  : "Favoritar",
              onClick: () => handleFavorite(selectedMovie),
              disabled: loadingFavorites[selectedMovie.id]
            },
          ]}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default MovieGrid;