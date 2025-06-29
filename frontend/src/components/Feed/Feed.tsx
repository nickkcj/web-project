import {FC, useEffect, useState} from "react";
import FeedItem from "./FeedItem";
import {getReviews, ReviewApiResponse} from "../../services/reviews";
import { useSelector } from "react-redux";

const Feed: FC = () => {
  const [reviews, setReviews] = useState<ReviewApiResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const currentUser = useSelector((state: any) => state.login.user);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getReviews();
        setReviews(data);
      } catch (err) {
        console.error("Erro ao buscar reviews:", err);
        setError("Erro ao carregar o feed. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading) {
    return <div>Carregando feed...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
      <div className="space-y-6">
        {reviews.map((p) => (
            <FeedItem
                key={p.id}
                id={p.id}
                poster={p.posterUrl}
                user={p.user}
                rating={p.rating}
                text={p.text}
                time={p.time}
                comments={p.comments}
                currentUser={currentUser}
            />
        ))}
      </div>
  );
};

export default Feed;
