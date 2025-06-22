import { FC, useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import FilterRow from "./FilterRow";
import MovieGrid from "./MovieGrid";
import { getPopularMovies, getMovieDetails, searchMovies } from "../../services/movies";
import {getImageUrl} from "../../utils/image";

export interface Movie {
  id: number;
  title: string;
  year: string;
  poster: string;
  tag?: string;
}

const filterLabels = ["Trending", "Top IMDb", "Ação", "Comédia", "Drama"];

const MoviesPage: FC = () => {
  const [activeFilter, setActiveFilter] = useState(filterLabels[0]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTrending();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchTrending = async () => {
    try {
      setLoading(true);
      const raw = await getPopularMovies();
      setMovies(
        raw.map((m) => ({
          id: m.id,
          title: m.title,
          year: m.release_date?.slice(0, 4) ?? "",
          poster: m.poster_path
            ? getImageUrl(m.poster_path)
            : "/placeholder.jpg",
        }))
      );
    } catch (err: any) {
      setError(err.message ?? "Erro ao buscar filmes");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (term: string) => {
    if (!term.trim()) {
      fetchTrending();
      return;
    }
    try {
      setLoading(true);
      const raw = await searchMovies(term);
      setMovies(
        raw.map((m) => ({
          id: m.id,
          title: m.title,
          year: m.release_date?.slice(0, 4) ?? "",
          poster: m.poster_path
            ? getImageUrl(m.poster_path)
            : "/placeholder.jpg",
        }))
      );
      setActiveFilter("Resultados");
    } catch (err: any) {
      setError(err.message ?? "Erro na pesquisa");
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (label: string) => {
    setActiveFilter(label);
    switch (label) {
      case "Trending":
        fetchTrending();
        break;
      default:
        fetchTrending();
    }
  };

  return (
    <div className="px-5 pb-16">
      <SearchBar onSearch={handleSearch} />
      <FilterRow
        filters={filterLabels}
        active={activeFilter}
        onChange={handleFilter}
      />

      {loading ? (
        <div className="min-h-[50vh] flex items-center justify-center text-slate-400">
          Carregando filmes…
        </div>
      ) : error ? (
        <div className="min-h-[50vh] flex items-center justify-center text-red-400">
          {error}
        </div>
      ) : (
        <MovieGrid movies={movies} />
      )}
    </div>
  );
};

export default MoviesPage;
