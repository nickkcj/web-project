import React, { useEffect, useRef, useState } from "react";

interface CarouselItem {
  id: number;
  poster: string;
  title: string;
  rating?: number;
  text?: string;
  isFavorite?: boolean;
}

interface CarouselProps {
  items: CarouselItem[];
  onSelect: (item: CarouselItem) => void;
  title?: string;
  type?: 'reviews' | 'favorites';
  itemSize?: 'small' | 'default';
}

export const Carousel: React.FC<CarouselProps> = ({ 
  items, 
  onSelect, 
  title, 
  type = 'reviews',
  itemSize = 'default',
}) => {
  const [current, setCurrent] = useState(0);
  const [slideW, setSlideW] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const measure = () => {
      if (cardRef.current) {
        setSlideW(cardRef.current.offsetWidth + 32);
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  if (items.length === 0) return null;

  let maxSlides = 0;
  let visibleCards = 1;
  if (slideW > 0) {
    visibleCards = Math.max(1, Math.floor(window.innerWidth / slideW));
    maxSlides = Math.max(0, items.length - visibleCards);
  }

  const canGoNext = slideW === 0 || current < maxSlides;
  const canGoPrev = current > 0;

  return (
    <section className="mb-4 relative">
      {title && (
        <h2 className="text-white text-xl md:text-xl font-bold mb-1 text-center">
          {title}
        </h2>
      )}
      <div className="overflow-hidden" tabIndex={0}>
        <div
          className="flex gap-4 sm:gap-6"
          style={{
            transform: `translateX(-${current * slideW}px)`,
            transition: "transform 600ms ease",
          }}
        >
          {items.map((item, idx) => (
            <div
              key={item.id}
              ref={idx === 0 ? cardRef : null}
              className={`rounded-[10px] p-2 sm:p-4 flex-none flex flex-col items-center cursor-pointer hover:scale-105 transition-transform ${itemSize === 'small' ? 'w-[8.5rem] sm:w-[10rem]' : 'w-[15rem]'}`}
              onClick={() => onSelect(item)}
            >
              <img
                src={item.poster}
                alt={item.title}
                className={`w-full object-cover rounded mb-2 sm:mb-4 ${itemSize === 'small' ? 'h-[140px] sm:h-[180px]' : 'h-[auto]'}`}
                onError={(e) =>
                  (e.currentTarget.src = "https://via.placeholder.com/220x320?text=No+Image")
                }
              />
              <div className={`text-white font-semibold mb-1 text-center line-clamp-2 ${itemSize === 'small' ? 'text-xs sm:text-sm' : 'text-lg'}`}>
                {item.title}
              </div>
              {item.rating !== undefined && (
                <div className={`flex items-center mb-1 ${itemSize === 'small' ? 'text-base' : ''}`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className="text-xl"
                      style={{
                        color: i < item.rating! ? "var(--id-color-yellow, #FCD34D)" : "#4B5563",
                      }}
                    >
                      ★
                    </span>
                  ))}
                </div>
              )}
              {item.text && (
                <div className={`text-gray-300 text-center line-clamp-3 ${itemSize === 'small' ? 'text-[11px] sm:text-xs' : 'text-sm'}`}>
                  {type === 'reviews' ? `"${item.text}"` : item.text}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {items.length > 1 && (
        <>
          <button
            onClick={() => {
              setCurrent((prev) => Math.max(0, prev - 1));
            }}
            className="absolute left-0 top-1/2 -translate-y-1/2 text-2xl text-white bg-[#1E252C] rounded-full px-2 py-1 shadow hover:bg-[#323a42] transition z-10 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Previous"
            style={{ left: "10px" }}
            disabled={!canGoPrev}
          >
            ‹
          </button>
          <button
            onClick={() => {
              setCurrent((prev) => Math.min(maxSlides, prev + 1));
            }}
            className="absolute right-0 top-1/2 -translate-y-1/2 text-2xl text-white bg-[#1E252C] rounded-full px-2 py-1 shadow hover:bg-[#323a42] transition z-10 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Next"
            style={{ right: "10px" }}
            disabled={!canGoNext}
          >
            ›
          </button>
        </>
      )}
    </section>
  );
};