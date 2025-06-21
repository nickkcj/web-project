import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import services from "../../services/services";

interface Review {
  id: number;
  movieId: number;
  rating: number;
  comment: string;
  createdAt: string;
  movie?: {
    id: number;
    title: string;
    poster_path: string;
    release_date: string;
  };
}

const Stars: FC<{ n: number }> = ({ n }) => (
  <span className="text-yellow-400">{Array.from({ length: n }).map(() => "★")}</span>
);

const MyReviewsPage: FC = () => {
  const [reviews, setReviews] = useState<Review[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useSelector((state: any) => state.login);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const loadReviews = async () => {
      try {
        const userId = typeof user.id === 'string' ? parseInt(user.id) : user.id;
        const userReviews = await services.getReviewsByUserId(userId);
        setReviews(Array.isArray(userReviews) ? userReviews : []);
      } catch (err: any) {
        console.error('Error loading reviews:', err);
        setError(err.message ?? "Erro inesperado");
      }
    };

    loadReviews();
  }, [user, navigate]);

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
          onClick={() => navigate("/movies")}
          className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 rounded-md"
        >
          Explorar filmes
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 pt-12 px-4">
      <h1 className="text-3xl font-bold text-center mb-10">Minhas Avaliações</h1>

      <div className="flex flex-wrap justify-center gap-6">
        {reviews.map((rev) => (
          <article
            key={`${rev.id}-${rev.createdAt}`}
            className="w-72 bg-slate-800 rounded-xl overflow-hidden shadow-lg"
          >
            {rev.movie && (
              <img
                src={`https://image.tmdb.org/t/p/w342${rev.movie.poster_path}`}
                alt={rev.movie.title}
                className="h-44 w-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/300x450?text=No+Image';
                }}
              />
            )}
            <div className="p-4 flex flex-col gap-2">
              {rev.movie && (
                <>
                  <h3 className="font-semibold truncate">{rev.movie.title}</h3>
                  <p className="text-sm text-slate-400">
                    {rev.movie.release_date ? new Date(rev.movie.release_date).getFullYear() : 'N/A'}
                  </p>
                </>
              )}

              <Stars n={rev.rating} />

              <p className="text-sm italic line-clamp-3">"{rev.comment}"</p>

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