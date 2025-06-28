import {FC, useEffect, useState} from "react";
import { TrendingUp, Heart, ImageOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getPopularMovies, PopularMovie } from "../../services/sidebar";
import services from "../../services";
import { MovieModal } from "../Movie/MovieModal";
import {getImageUrl} from "../../utils/image";

const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

export const Sidebar: FC = () => {
    const [trending, setTrending] = useState<PopularMovie[]>([]);
    const [favorites, setFavorites] = useState<any[]>([]);
    const [selectedMovie, setSelectedMovie] = useState<any | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [unfavoriteLoading, setUnfavoriteLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTrending = async () => {
            try {
                setLoading(true);
                const movies = await getPopularMovies(6);
                setTrending(Array.isArray(movies) ? movies : []);
            } catch (error) {
                console.error("Erro ao carregar filmes populares:", error);
                setTrending([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTrending();
    }, []);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const favs = await services.getUserFavorites();
                const mapped = Array.isArray(favs)
                  ? favs.map((fav) => ({
                      id: fav.movie?.id || fav.id,
                      title: fav.movie?.title || '',
                      poster: fav.movie?.poster_path ? getImageUrl(fav.movie.poster_path) : '',
                      movieId: fav.movie?.id || fav.movieId || fav.id,
                  }))
                  : [];
                setFavorites(mapped);
            } catch (error) {
                setFavorites([]);
            }
        };
        fetchFavorites();
    }, []);

    const handlePosterClick = async (movieId: number) => {
        try {
            const details = await services.getMovieDetails(movieId);
            setSelectedMovie({
                id: details.id,
                title: details.title,
                year: details.release_date ? new Date(details.release_date).getFullYear().toString() : '',
                poster: `https://image.tmdb.org/t/p/w342${details.poster_path}`,
                overview: details.overview,
            });
            setShowModal(true);
        } catch (error) {
            setSelectedMovie(null);
            setShowModal(false);
        }
    };
    const handleRate = (movie: any) => {
        const movieForModal = {
            id: movie.id,
            title: movie.title,
            year: movie.year,
            poster: movie.poster,
            overview: movie.overview,
        };
        navigate("/rate", { state: { movie: movieForModal } });
    };

    const handleUnfavorite = async (movie: any) => {
        if (unfavoriteLoading) return;
        try {
            setUnfavoriteLoading(true);
            await services.toggleFavorite(movie.id);
            setFavorites((prev) => prev.filter((f) => f.movieId !== movie.id && f.id !== movie.id));
            setShowModal(false);
        } catch (error) {
            console.error('Erro ao remover dos favoritos:', error);
        } finally {
            setUnfavoriteLoading(false);
        }
    };

    return (
        <aside className="sticky top-20 space-y-10 hidden lg:block">
            <Section title="Trending Films" icon={TrendingUp}>
                {loading ? (
                    <p className="text-sm text-slate-500">Carregando...</p>
                ) : trending && trending.length > 0 ? (
                    <ul className="grid grid-cols-2 gap-4">
                        {trending.map((f) => (
                            <PosterCard
                                key={f.id}
                                film={{
                                    ...f,
                                    poster: getImageUrl(f.poster_path),
                                }}
                                showRating
                                onClick={() => handlePosterClick(f.id)}
                            />
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-slate-500">Nenhum filme encontrado</p>
                )}
            </Section>

            <Section title="Your Favourites" icon={Heart}>
                {favorites.length ? (
                    <ul className="flex gap-4 overflow-x-auto pb-1 hide-scrollbar custom-scrollbar">
                        {favorites.slice(0, 6).map((f) => (
                            <PosterCard
                                key={f.id}
                                film={{
                                    ...f,
                                    poster: f.poster
                                }}
                                compact
                                onClick={() => handlePosterClick(f.movieId)}
                            />
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-slate-500">Add movies to see them here ✨</p>
                )}
            </Section>

            {/* por hora é uma ideia, não implementada
            <Section title="Watchlist" icon={Bookmark}>
                {watchlist.length ? (
                    <ul className="space-y-3">
                        {watchlist.map((f) => (
                            <li key={f.id} className="flex gap-3 items-center">
                                <img
                                    src={f.poster}
                                    alt={f.title}
                                    className="w-10 h-14 object-cover rounded-md"
                                />
                                <p className="text-sm truncate">{f.title}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-slate-500">Save films to watch later 🎬</p>
                )}
            </Section>*/}

            {showModal && selectedMovie && (
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
                            disabled: unfavoriteLoading,
                        },
                    ]}
                    onClose={() => setShowModal(false)}
                />
            )}
        </aside>
    );
};

interface SectionProps {
  title: string;
  icon: typeof TrendingUp;
  children: React.ReactNode;
}

const Section: FC<SectionProps> = ({ title, icon: Icon, children }) => (
  <section>
    <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
      <Icon size={18} /> {title}
    </h2>
    {children}
  </section>
);

const PosterCard: FC<{
  film: { poster: string | null; title: string; vote_average?: number };
  showRating?: boolean;
  compact?: boolean;
  onClick?: () => void;
}> = ({ film, showRating, compact, onClick }) => (
  <li className={cn("relative group cursor-pointer flex-none w-24") + (compact ? "" : "") } onClick={onClick}>
    <div className="relative">
      {film.poster ? (
        <img
          src={film.poster}
          alt={film.title}
          className={cn(
            "rounded-lg object-cover",
            compact ? "h-32 w-full" : "h-36 w-full"
          )}
        />
      ) : (
        <div
          className={cn(
            "flex items-center justify-center rounded-lg border border-slate-300/60 bg-transparent",
            compact ? "h-32 w-full" : "h-36 w-full"
          )}
        >
          <ImageOff className="text-slate-300 w-8 h-8" />
        </div>
      )}
      {showRating && film.vote_average && (
        <span className="absolute bottom-1 right-1 z-10 text-[11px] px-2 py-0.5 rounded bg-slate-900/80 text-amber-300 flex items-center gap-1 shadow-md">
          ★ {film.vote_average.toFixed(1)}
        </span>
      )}
    </div>
    <div className="mt-2">
      <span className="block text-xs text-center truncate w-full">{film.title}</span>
    </div>
  </li>
);