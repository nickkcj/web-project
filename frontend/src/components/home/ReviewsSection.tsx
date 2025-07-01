import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Carousel } from "../Carousel/Carousel";
import { getReviews, ReviewApiResponse } from "../../services/reviews";
import { MovieReviewModal } from '../../components/MoveReviewModal/MoveReviewModal';

export const ReviewsSection: React.FC = () => {
  const [reviews, setReviews] = useState<ReviewApiResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLogged, setIsLogged] = useState(false);
  const [selectedReview, setSelectedReview] = useState<ReviewApiResponse | null>(null);
  const { user } = useSelector((state: any) => state.login);

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

  const handleReviewClick = (review: ReviewApiResponse) => {
    setSelectedReview(review);
  };

  const handleReviewCarouselSelect = (item: { id: number }) => {
    const review = reviews.find(r => r.id === item.id);
    if (review) {
      handleReviewClick(review);
    }
  };

  const handleEditReview = () => {
    if (selectedReview) {
      window.location.href = `/review/${selectedReview.id}/edit`;
    }
  };

  return (
    <section className="mb-[60px]">
      <Carousel
        items={carouselItems}
        onSelect={handleReviewCarouselSelect}
        title="Últimas Avaliações"
        type="reviews"
      />
      {selectedReview && (
        <MovieReviewModal
          review={{
            poster: selectedReview.posterUrl,
            title: selectedReview.user,
            rating: selectedReview.rating,
            text: selectedReview.text,
            details: selectedReview.time,
          }}
          onClose={() => setSelectedReview(null)}
          onEdit={user && selectedReview.user === user.name ? handleEditReview : undefined}
        />
      )}
    </section>
  );
};
