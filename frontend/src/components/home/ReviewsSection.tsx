import React, { useEffect, useRef, useState } from "react";
import originPoster from "../../Assets/Photos/origin_poster.jpg";
import aquiPoster from "../../Assets/Photos/aqui.jpg";
import theWitchPoster from "../../Assets/Photos/The_Witch_poster.png";
import spiderMan2TobyPoster from "../../Assets/Photos/spiderMan2TobyPoster.jpg";
import theAvengersPoster from "../../Assets/Photos/theAvengersPoster.jpg";
import transformersPoster from "../../Assets/Photos/transformersPoster.jpg";
import spiderManAcrossTheSpiderVersePoster from "../../Assets/Photos/spiderManAcrossTheSpiderVersePoster.jpg";
import { MovieReviewModal } from "../MoveReviewModal/MoveReviewModal";


const reviews = [
  {
    poster: aquiPoster,
    title: "Us",
    rating: 5,
    text: "A chilling and thought-provoking thriller that keeps you guessing until the end.",
    details: "A family’s serene beach vacation turns to chaos when their doppelgängers appear.",
  },
  {
    poster: theWitchPoster,
    title: "The Witch",
    rating: 4,
    text: "A haunting atmosphere and stellar performances make this a must-watch for horror fans.",
    details: "A Puritan family encounters evil forces in the woods beyond their New England farm.",
  },
  {
    poster: originPoster,
    title: "Origin",
    rating: 4,
    text: "A powerful and moving exploration of history and identity.",
    details: "A drama about the journey of exploring the roots of caste and inequality.",
  },
  {
    poster: spiderMan2TobyPoster,
    title: "Spider-Man 2",
    rating: 4,
    text: "An exciting superhero adventure with heart, humor, and unforgettable action.",
    details: "Peter Parker struggles to balance his life as a college student and his responsibilities as Spider-Man while facing the powerful Doctor Octopus.",
  },
  {
    poster: theAvengersPoster,
    title: "The Avengers",
    rating: 5,
    text: "A spectacular superhero team-up that delivers action, humor, and heart.",
    details: "Earth’s mightiest heroes join forces to stop Loki and his alien army from conquering the world.",
  },
  {
    poster: transformersPoster,
    title: "Transformers",
    rating: 3,
    text: "Explosive action and impressive effects make for a fun blockbuster ride.",
    details: "Giant alien robots wage war on Earth, with humanity caught in the middle of the battle between Autobots and Decepticons.",
  },
  {
    poster: spiderManAcrossTheSpiderVersePoster,
    title: "Spider-Man: Across the Spider-Verse",
    rating: 5,
    text: "A visually stunning and emotionally rich sequel that pushes animation boundaries.",
    details: "Miles Morales embarks on a multiversal adventure, meeting new Spider-People and facing a threat bigger than ever before.",
  },
];

export const ReviewsSection: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [anim, setAnim] = useState(true);
  const [slideW, setSlideW] = useState(0);
  const [selected, setSelected] = useState<any>(null);
  const [paused, setPaused] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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

  useEffect(() => {
    if (paused) {
      return;
    }
    intervalRef.current = setInterval(() => {
      setAnim(true);
      setCurrent((prev) => prev + 1);
    }, 3000);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [paused]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === "INPUT") return;
      if (e.key === "ArrowRight") {
        setAnim(true);
        setCurrent((prev) => prev + 1);
      }
      if (e.key === "ArrowLeft") {
        setAnim(true);
        setCurrent((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // --- Volta instantaneamente ao início ao chegar no conjunto clonado ---
  const handleEnd = () => {
    if (current >= reviews.length) {
      setAnim(false);
      setCurrent(0);
    }
  };

  const onMouseEnter = () => setPaused(true);
  const onMouseLeave = () => setPaused(false);

  // --- Slides data: duas vezes para criar o loop ---
  const slides = [...reviews, ...reviews];

  return (
    <section className="mb-[60px] relative">
      <h2 className="text-white text-2xl md:text-3xl font-bold mb-8 text-center">
        Últimas Avaliações
      </h2>

      <div
        className="overflow-hidden"
        tabIndex={0}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onFocus={onMouseEnter}
        onBlur={onMouseLeave}
        aria-label="carousel"
      >
        <div
          className="flex gap-8"
          onTransitionEnd={handleEnd}
          style={{
            transform: `translateX(-${current * slideW}px)`,
            transition: anim ? "transform 600ms cubic-bezier(.85,.01,.32,1.07)" : "none",
            willChange: "transform",
          }}
        >
          {slides.map((review, idx) => (
            <div
              key={idx}
              ref={idx === 0 ? cardRef : null}
              className="bg-[#1E252C] rounded-[10px] p-4 w-[220px] flex-none flex flex-col items-center shadow-lg cursor-pointer hover:scale-105 transition-transform"
              onClick={() => setSelected(review)}
              tabIndex={0}
              aria-label={`Review: ${review.title}`}
            >
              <img
                src={review.poster}
                alt={review.title}
                className="w-full h-[320px] object-cover rounded mb-4"
              />
              <div className="text-white text-lg font-semibold mb-2 text-center">
                {review.title}
              </div>
              <div className="flex items-center mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className="text-xl"
                    style={{
                      color:
                        i < review.rating
                          ? "var(--id-color-yellow)"
                          : "#4B5563",
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>
              <div className="text-gray-300 text-sm text-center">
                &quot;{review.text}&quot;
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* modal */}
      {selected && (
        <MovieReviewModal
          review={selected}
          onClose={() => setSelected(null)}
        />
      )}

      <button
        onClick={() => {
          setAnim(true);
          setCurrent((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
        }}
        className="absolute left-0 top-1/2 -translate-y-1/2 text-2xl text-white bg-[#1E252C] rounded-full px-2 py-1 shadow hover:bg-[#323a42] transition z-10"
        aria-label="Previous"
        style={{ left: "10px" }}
      >
        ‹
      </button>
      <button
        onClick={() => {
          setAnim(true);
          setCurrent((prev) => prev + 1);
        }}
        className="absolute right-0 top-1/2 -translate-y-1/2 text-2xl text-white bg-[#1E252C] rounded-full px-2 py-1 shadow hover:bg-[#323a42] transition z-10"
        aria-label="Next"
        style={{ right: "10px" }}
      >
        ›
      </button>
    </section>
  );
};
