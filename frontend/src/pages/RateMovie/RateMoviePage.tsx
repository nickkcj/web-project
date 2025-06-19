import { FC, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Movie } from "../../components/Movie/MovieModal";

interface LocationState {
  movie: Movie;
}

const RateMoviePage: FC = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState<string>("");
  const movie = (state as LocationState | undefined)?.movie;

  if (!movie) {
    navigate("/", { replace: true });
    return null;
  }

  const handleSubmit = () => {
    console.log({ movieId: movie.id, rating, review });
    navigate("/feed");
  };

  return (
    <div className="min-h-screen flex flex-col items-center pt-10 px-4 bg-[#0B0E13] text-slate-100">
      <h1 className="text-3xl font-bold mb-6">Avaliar filme</h1>

      <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl bg-[#1E252C] rounded-2xl p-6 shadow-2xl">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-40 h-60 object-cover rounded-lg self-center"
        />

        <div className="flex-1 flex flex-col gap-6">
          {/* Movie title & year */}
          <header>
            <h2 className="text-2xl font-semibold">{movie.title}</h2>
            <p className="text-slate-400">{movie.year}</p>
          </header>

          {/* Star rating */}
          <StarRating rating={rating} onChange={setRating} />

          {/* Review textarea */}
          <textarea
            className="w-full h-40 bg-[#0F141B] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            placeholder="Escreva sua avaliação..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
          />

          {/* Action buttons */}
          <div className="flex justify-end gap-4">
            <button
              className="px-4 py-2 rounded-lg bg-transparent border border-slate-500 hover:bg-slate-700 transition"
              onClick={() => navigate(-1)}
            >
              Cancelar
            </button>
            <button
              disabled={rating === 0 || review.trim() === ""}
              className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition"
              onClick={handleSubmit}
            >
              Publicar
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
