import { FC } from "react";

interface Movie {
  id: number;
  title: string;
  year: string;
  poster: string;
  tag?: string; // e.g. "HD"
}

interface Props {
  movies: Movie[];
}

const MovieGrid: FC<Props> = ({ movies }) => (
  <div className="mt-12 flex flex-wrap justify-center gap-8 px-4">
    {movies.map((m) => (
      <div key={m.id} className="relative flex flex-col items-center w-36">
        {/* small tag badge */}
        {m.tag && (
          <span className="absolute top-2 right-2 bg-slate-900/80 text-[10px] px-1 rounded">
            {m.tag}
          </span>
        )}

        {/* poster */}
        <img
          src={m.poster}
          alt={m.title}
          className="w-full h-52 object-cover rounded-md hover:brightness-110 transition"
        />

        {/* title & year */}
        <p className="mt-2 text-sm text-slate-200 text-center truncate w-full">
          {m.title}
        </p>
        <p className="text-xs text-slate-400">{m.year}</p>
      </div>
    ))}
  </div>
);

export default MovieGrid;
