import {FC, useEffect, useState} from "react";
import { TrendingUp, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import services from "../../services";
import { MovieModal } from "../Movie/MovieModal";
import {getImageUrl} from "../../utils/image";

/* tiny clsx helper */
const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

/* Mock para trending movies */
const mockTrending = [
  {
    id: 1,
    title: "Mickey 17",
    poster: "https://image.tmdb.org/t/p/w342/8QVDXDiOGHRcAD4oM6MXjE0osSj.jpg",
    vote_average: 4.3,
  },
  {
    id: 2,
    title: "The List",
    poster: "https://image.tmdb.org/t/p/w342/2u7zbn8EudG6kLlBzUYqP8RyFU4.jpg",
    vote_average: 4.1,
  },
  {
    id: 3,
    title: "Saltburn",
    poster: "https://image.tmdb.org/t/p/w342/6b7swg6DLqXCO3XUsMnv6RwDMW2.jpg",
    vote_average: 4.0,
  },
  {
    id: 4,
    title: "Whiplash",
    poster: "https://image.tmdb.org/t/p/w342/oPxnRhyAIzJKGUEdSiwTJQBa6hz.jpg",
    vote_average: 4.7,
  },
];

export const Sidebar: FC = () => {
    const [trending, setTrending] = useState<any[]>(mockTrending);
    const [favorites, setFavorites] = useState<any[]>([]);
    const [selectedMovie, setSelectedMovie] = useState<any | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [unfavoriteLoading, setUnfavoriteLoading] = useState(false);
    const navigate = useNavigate();

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
        // Garante que o objeto movie tem os campos corretos
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
                {trending && trending.length > 0 ? (
                    <ul className="grid grid-cols-2 gap-4">
                        {trending.map((f) => (
                            <PosterCard
                                key={f.id}
                                film={f}
                                showRating
                                // Não precisa de onClick para trending
                            />
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-slate-500">Nenhum filme encontrado</p>
                )}
            </Section>

            <Section title="Your Favourites" icon={Heart}>
                {favorites.length ? (
                    <ul className="flex gap-4 overflow-x-auto pb-1 hide-scrollbar">
                        {favorites.map((f) => (
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
  film: { poster: string; title: string; vote_average?: number };
  showRating?: boolean;
  compact?: boolean;
  onClick?: () => void;
}> = ({ film, showRating, compact, onClick }) => (
  <li className={cn("relative group cursor-pointer", compact && "flex-none w-20")} onClick={onClick}>
    <img
      src={film.poster}
      alt={film.title}
      className={cn(
        "rounded-lg object-cover",
        compact ? "h-28 w-full" : "h-32 w-full"
      )}
    />
    {showRating && film.vote_average && (
      <span className="absolute bottom-1 right-1 text-[10px] px-1 py-0.5 rounded bg-slate-900/80 text-amber-300">
        ★ {film.vote_average.toFixed(1)}
      </span>
    )}
    <p
      className={cn(
        "mt-1 text-xs text-center truncate w-full",
        compact && "hidden"
      )}
    >
      {film.title}
    </p>
  </li>
);
