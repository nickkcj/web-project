import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Movie } from "./MoviesPage";
import { MovieModal } from "../../components/movie/MovieModal";
import services from "../../services/services";

interface Props {
  movies: Movie[];
}

const MovieGrid: FC<Props> = ({ movies }) => {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [favoriteStates, setFavoriteStates] = useState<Record<number, boolean>>({});
  const navigate = useNavigate();

  const handleFavorite = async (movie: Movie) => {
    try {
      // First, create the movie in database if it doesn't exist
      await services.createMovieInDatabase({
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster.replace('https://image.tmdb.org/t/p/w342', ''),
        backdrop_path: '', // We don't have backdrop in this context
        overview: '', // We don't have overview in this context
        release_date: movie.year + '-01-01', // Approximate date
        popularity: 0,
        original_language: 'en'
      });

      // Then toggle favorite
      const result = await services.toggleFavorite(movie.id);
      setFavoriteStates(prev => ({
        ...prev,
        [movie.id]: result.favorited
      }));
      
      console.log(result.favorited ? 'Filme favoritado!' : 'Filme removido dos favoritos!');
    } catch (error) {
      console.error('Error toggling favorite:', error);
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
            onClick={() => setSelectedMovie(m)}
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
              label: favoriteStates[selectedMovie.id] ? "Desfavoritar" : "Favoritar", 
              onClick: () => handleFavorite(selectedMovie) 
            },
          ]}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </>
  );
};

export default MovieGrid;