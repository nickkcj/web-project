import { FC, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Movie } from "../../components/Movie/MovieModal";
import services from "../../services/index";

interface LocationState {
  movie: Movie;
  review?: {
    id: number;
    rating: number;
    comment: string;
    visibility: 'PUBLIC' | 'PRIVATE';
  };
}

const RateMoviePage: FC = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [rating, setRating] = useState<number>(state?.review?.rating ?? 0);
  const [review, setReview] = useState<string>(state?.review?.comment ?? "");
  const [visibility, setVisibility] = useState<'PUBLIC' | 'PRIVATE'>(state?.review?.visibility ?? 'PUBLIC');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const movie = (state as LocationState | undefined)?.movie;

  if (!movie) {
    navigate("/", { replace: true });
    return null;
  }

  const handleSubmit = async () => {
    if (rating === 0 || review.trim() === "") {
      alert("Por favor, adicione uma avaliação e um comentário.");
      return;
    }

    try {
      setIsSubmitting(true);

      if (state?.review?.id) {
        await services.updateReview(state.review.id, {
          rating,
          comment: review.trim(),
          visibility,
        });
        alert("Review atualizada com sucesso!");
      } else {
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

        await services.createReview({
          movieId: movie.id,
          rating,
          comment: review.trim(),
          visibility,
        });

        alert("Review criada com sucesso!");
      }

      navigate("/profile");
    } catch (error) {
      console.error('Erro ao salvar review:', error);
      alert("Erro ao salvar review. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center pt-10 px-4 bg-[#0B0E13] text-slate-100">
      <h1 className="text-3xl font-bold mb-6">
        {state?.review ? "Editar avaliação" : "Avaliar filme"}
      </h1>

      <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl bg-[#1E252C] rounded-2xl p-6 shadow-2xl">
        <div className="w-full md:w-1/3 lg:w-1/2 flex justify-center">
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-full h-auto object-cover rounded-lg"
          />
        </div>

        <div className="flex-1 flex flex-col gap-6 text-left">
          <header>
            <h2 className="text-2xl font-semibold">{movie.title}</h2>
            <p className="text-slate-400">{movie.year}</p>
          </header>

          <div>
            <label className="block text-sm font-medium mb-2">Sua avaliação:</label>
            <StarRating rating={rating} onChange={setRating} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Visibilidade:</label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="visibility"
                  value="PUBLIC"
                  checked={visibility === 'PUBLIC'}
                  onChange={(e) => setVisibility(e.target.value as 'PUBLIC' | 'PRIVATE')}
                  className="mr-2"
                />
                Público
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="visibility"
                  value="PRIVATE"
                  checked={visibility === 'PRIVATE'}
                  onChange={(e) => setVisibility(e.target.value as 'PUBLIC' | 'PRIVATE')}
                  className="mr-2"
                />
                Privado
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Sua resenha:</label>
            <textarea
              className="w-full h-40 bg-[#0F141B] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              placeholder="Escreva sua avaliação..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              className="w-fit ml-auto bg-red-600/90 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-medium transition-colors border border-red-500/50 shadow-lg flex items-center justify-center gap-2"
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              disabled={rating === 0 || review.trim() === "" || isSubmitting}
              className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition"
              onClick={handleSubmit}
            >
              {isSubmitting
                ? state?.review
                  ? "Salvando..."
                  : "Publicando..."
                : state?.review
                ? "Salvar alterações"
                : "Publicar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface StarProps {
  rating: number;
  onChange: (val: number) => void;
}

const StarRating: FC<StarProps> = ({ rating, onChange }) => (
  <div className="flex gap-1 text-2xl cursor-pointer select-none">
    {[1, 2, 3, 4, 5].map((v) => (
      <span
        key={v}
        onClick={() => onChange(v)}
        className={v <= rating ? "text-yellow-400" : "text-slate-600"}
      >
        ★
      </span>
    ))}
  </div>
);

export default RateMoviePage;
