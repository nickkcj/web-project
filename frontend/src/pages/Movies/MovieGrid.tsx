import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Movie } from "./MoviesPage";
import { MovieModal } from "../../components/Movie/MovieModal";

interface Props {
  movies: Movie[];
}

const MovieGrid: FC<Props> = ({ movies }) => {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const navigate = useNavigate();

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
              onClick: () =>
                navigate("/rate", { state: { movie: selectedMovie } }),
            },
            { label: "Favoritar", onClick: () => console.log("Favoritar") },
            {
              label: "Adicionar ao Wishlist",
              onClick: () => console.log("Wishlist"),
            },
          ]}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </>
  );
};

export default MovieGrid;
