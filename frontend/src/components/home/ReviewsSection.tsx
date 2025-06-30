import React, { useEffect, useState } from "react";
import { Carousel } from "../Carousel/Carousel";
import { getReviews, ReviewApiResponse } from "../../services/reviews";


export const ReviewsSection: React.FC = () => {
  const [reviews, setReviews] = useState<ReviewApiResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsLogged(!!token);
    if (!token) {
      setLoading(false);
      return;
    }
    getReviews()
      .then((data) => setReviews(data.slice(0, 12)))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, []);

  if (!isLogged || loading || reviews.length === 0) return null;

  const carouselItems = reviews.map((review) => ({
    id: review.id,
    poster: review.posterUrl || '',
    title: review.user || 'Filme',
    rating: review.rating,
    text: review.text,
  }));

  return (
    <section className="mb-[60px]">
      <Carousel
        items={carouselItems}
        onSelect={() => {}}
        title="Últimas Avaliações"
        type="reviews"
      />
    </section>
  );
};
