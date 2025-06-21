import React, { useEffect } from "react";
import ReactDOM from "react-dom";

interface Review {
  poster: string;
  title: string;
  rating: number;
  text: string;
  details: string;
  overview?: string;
}

interface Props {
  review: Review;
  onClose: () => void;
  onViewMovie?: () => void;
  onEdit?: () => void;
  onDelete?: () => Promise<void>;
}

export const MovieReviewModal: React.FC<Props> = ({ review, onClose, onViewMovie, onEdit, onDelete }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleEsc);
    document.body.style.overflow = 'hidden'; // Previne scroll da página de fundo
    
    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="relative bg-[#1E252C] text-white rounded-2xl shadow-2xl w-[90%] max-w-4xl
                   flex flex-col md:flex-row overflow-hidden animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Poster */}
        <div className="md:w-1/3 flex-shrink-0">
          <img
            src={review.poster}
            alt={review.title}
            className="h-64 md:h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/300x450?text=No+Image';
            }}
          />
        </div>

        {/* Conteúdo da Review */}
        <div className="p-6 flex-1 flex flex-col gap-4">
          <div>
            <h3 className="text-2xl font-bold mb-2">{review.title}</h3>
            {review.overview && (
              <div className="text-sm text-slate-400 mt-4">
                <strong className="text-white">Descrição do Filme:</strong>
                <p className="mt-1">{review.overview}</p>
              </div>
            )}

            <div className="flex items-center gap-1 mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={`text-2xl ${
                    i < review.rating ? 'text-yellow-400' : 'text-gray-600'
                  }`}
                >
                  ★
                </span>
              ))}
              <span className="ml-2 text-gray-400">
                ({review.rating}/5)
              </span>
            </div>
          </div>

          <div className="flex-1">
            <h4 className="text-lg font-semibold mb-2 text-blue-300">Minha Review:</h4>
            <p className="text-gray-300 leading-relaxed italic text-lg mb-4">
              "{review.text}"
            </p>
            <p className="text-sm text-gray-400">{review.details}</p>
          </div>

          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-600">
            {onEdit && (
              <button
                onClick={onEdit}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
              >
                Editar
              </button>
            )}

            {onDelete && (
              <button
                onClick={onDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
              >
                Deletar
              </button>
            )}

            {onViewMovie && (
              <button
                onClick={onViewMovie}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Ver Filme
              </button>
            )}
          </div>
        </div>

        <button
          onClick={onClose}
          aria-label="Fechar modal"
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center text-2xl text-gray-400 hover:text-white hover:bg-slate-700 rounded-full transition-colors"
        >
          ×
        </button>
      </div>
    </div>,
    document.body
  );
};