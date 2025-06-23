import React, { useEffect } from "react";
import ReactDOM from "react-dom";

export interface Movie {
  overview?: string;
  id: number;
  title: string;
  year: string;
  poster: string;
  tag?: string;
}

interface Action {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

interface Props {
  movie: Movie;
  onClose: () => void;
  actions?: Action[];
}

export const MovieModal: React.FC<Props> = ({ movie, onClose, actions }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="relative bg-[#1E252C] text-white rounded-2xl shadow-2xl w-[90%] max-w-3xl flex flex-col md:flex-row overflow-hidden animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={movie.poster}
          alt={movie.title}
          className="h-64 md:h-auto md:w-1/3 object-cover"
        />

        <div className="p-6 flex-1 flex flex-col gap-4">
          <h3 className="text-2xl font-bold">
            {movie.title}{" "}
            <span className="text-slate-400 font-medium">({movie.year})</span>
          </h3>
          <p className="text-gray-400 text-sm mb-4">{movie.overview}</p>
          {movie.tag && (
            <span className="inline-block self-start bg-slate-700 text-xs px-2 py-0.5 rounded">
              {movie.tag}
            </span>
          )}

          <div className="flex-1" />

          {actions?.length ? (
            <div className="mt-4 flex justify-end gap-3">
              {actions.map((a, i) => (
                <button
                  key={i}
                  onClick={a.onClick}
                  disabled={a.disabled}
                  className={`px-3 py-1 text-sm rounded-lg transition ${
                    a.disabled 
                      ? 'bg-slate-800 text-gray-500 cursor-not-allowed'
                      : 'bg-slate-700 hover:bg-slate-600'
                  }`}
                >
                  {a.label}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-2 right-3 text-3xl leading-none text-gray-400 hover:text-white"
        >
          &times;
        </button>
      </div>
    </div>,
    document.body
  );
};