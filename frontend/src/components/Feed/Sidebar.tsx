import {FC, useEffect, useState} from "react";
import { TrendingUp, Heart, Bookmark } from "lucide-react";
import bladeRunner2049Poster from "../../Assets/Photos/bladeRunner2049Poster.jpg";
import dunePartTwoPoster from "../../Assets/Photos/dunePartTwoPoster.jpg";
import interstellarPoster from "../../Assets/Photos/interstellarPoster.jpg";
import mickey17Poster from "../../Assets/Photos/mickey17Poster.jpg";
import saltburnPoster from "../../Assets/Photos/saltburnPoster.jpg";
import poorThingsPoster from "../../Assets/Photos/poorThingsPoster.jpg";
import theListPoster from "../../Assets/Photos/theListPoster.jpg";
import whiplashPoster from "../../Assets/Photos/whiplashPoster.jpg";
import {getPopularMovies, PopularMovie} from "../../services/sidebar";
import {getImageUrl} from "../../utils/image";

/* tiny clsx helper */
const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

/* mock data – swap for API calls */
const mockTrending = [
  { id: 1, title: "Mickey 17", rating: 4.3, poster: mickey17Poster },
  { id: 2, title: "The List",  rating: 4.1, poster: theListPoster },
  { id: 3, title: "Saltburn",  rating: 4.0, poster: saltburnPoster },
];

const favourites = [
  { id: 7, title: "Whiplash", poster: whiplashPoster },
  { id: 8, title: "Blade Runner 2049", poster: bladeRunner2049Poster },
  { id: 9, title: "Interstellar", poster: interstellarPoster },
];

const watchlist = [
  { id: 12, title: "Poor Things",   poster: poorThingsPoster },
  { id: 13, title: "Dune: Part II", poster: dunePartTwoPoster },
];

export const Sidebar: FC = () => {

    const [trending, setTrending] = useState<PopularMovie[]>([]);
    const [loading, setLoading] = useState(true);

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

    return (
        <aside className="sticky top-20 space-y-10 hidden lg:block">
            {/* ── Trending ───────────────────────────────────────────── */}
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
                            />
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-slate-500">Nenhum filme encontrado</p>
                )}
            </Section>

            {/* ── Favourites ────────────────────────────────────────── */}
            <Section title="Your Favourites" icon={Heart}>
                {favourites.length ? (
                    <ul className="flex gap-4 overflow-x-auto pb-1 hide-scrollbar">
                        {favourites.map((f) => (
                            <PosterCard key={f.id} film={f} compact />
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-slate-500">Add movies to see them here ✨</p>
                )}
            </Section>

            {/* ── Watchlist ─────────────────────────────────────────── */}
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
            </Section>
        </aside>
    );
};

/* -------------------------------------------------------------------------- */

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

/* Compact poster w/ optional rating badge */
const PosterCard: FC<{
  film: { poster: string; title: string; vote_average?: number };
  showRating?: boolean;
  compact?: boolean;
}> = ({ film, showRating, compact }) => (
  <li className={cn("relative group", compact && "flex-none w-20")}>
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
