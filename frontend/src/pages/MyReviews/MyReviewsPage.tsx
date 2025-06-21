import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Movie } from "@/components/movie/MovieModal";
interface Review {
  id: number;
  movie: Movie;
  rating: number;
  text: string;
  createdAt: string;
}

const Stars: FC<{ n: number }> = ({ n }) => (
  <span className="text-yellow-400">{Array.from({ length: n }).map(() => "★")}</span>
);

const MyReviewsPage: FC = () => {
  const [reviews, setReviews] = useState<Review[] | null>(null);
  const [error,   setError]   = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/reviews/me", {
          credentials: "include",
          headers: { Accept: "application/json" },
        });

        if (!res.ok) {
          throw new Error(`Erro HTTP ${res.status}`);
        }

        const ct = res.headers.get("content-type") ?? "";
        if (!ct.includes("application/json")) {
          const body = await res.text();
          throw new Error("Resposta não-JSON recebida");
        }

        const data: Review[] = await res.json();
        setReviews(data);
      } catch (err: any) {
        setError(err.message ?? "Erro inesperado");
      }
    })();
  }, []);

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400">
        {error}
      </div>
    );

  if (reviews === null)
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400">
        Carregando…
      </div>
    );

  if (reviews.length === 0)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-slate-300">
        <p className="text-lg mb-4">Você ainda não fez nenhuma avaliação.</p>
        <button
          onClick={() => navigate("/feed")}
          className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 rounded-md"
        >
          Ir para o feed
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 pt-12 px-4">
      <h1 className="text-3xl font-bold text-center mb-10">Minhas Avaliações</h1>

      <div className="flex flex-wrap justify-center gap-6">
        {reviews.map((rev) => (
          <article
            key={rev.id}
            className="w-72 bg-slate-800 rounded-xl overflow-hidden shadow-lg"
          >
            <img
              src={rev.movie.poster}
              alt={rev.movie.title}
              className="h-44 w-full object-cover"
            />
            <div className="p-4 flex flex-col gap-2">
              <h3 className="font-semibold truncate">{rev.movie.title}</h3>
              <p className="text-sm text-slate-400">{rev.movie.year}</p>

              <Stars n={rev.rating} />

              <p className="text-sm italic line-clamp-3">“{rev.text}”</p>

              <p className="text-xs text-slate-500 mt-1">
                {new Date(rev.createdAt).toLocaleDateString("pt-BR")}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default MyReviewsPage;
