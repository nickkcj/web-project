import {FC, useEffect, useState} from "react";
import FeedItem, {FeedItemProps} from "./FeedItem";
import originPoster from "../../Assets/Photos/origin_poster.jpg";
import aquiPoster from "../../Assets/Photos/aqui.jpg";
import theWitchPoster from "../../Assets/Photos/The_Witch_poster.png";
import spiderMan2TobyPoster from "../../Assets/Photos/spiderMan2TobyPoster.jpg";
import theAvengersPoster from "../../Assets/Photos/theAvengersPoster.jpg";
import transformersPoster from "../../Assets/Photos/transformersPoster.jpg";
import spiderManAcrossTheSpiderVersePoster from "../../Assets/Photos/spiderManAcrossTheSpiderVersePoster.jpg";
import {getReviews, ReviewApiResponse} from "../../services/reviews";
import { useSelector } from "react-redux";

/* TODO replace with API fetch / RTK Query */
const demo: FeedItemProps[] = [
  {
    id: 1,
    poster: aquiPoster,
    user: "cinemalover98",
    rating: 5,
    text: "A chilling and thought-provoking thriller that keeps you guessing until the end.",
    time: "3 h ago",
    comments: [
      { id: 1, user: "moviebuff", text: "Totally agree!" },
      { id: 2, user: "filmgeek", text: "This one was wild 😱" },
      { id: 3, user: "noSpoilers", text: "Need to watch it soon." },
    ],
  },
  {
    id: 2,
    poster: theWitchPoster,
    user: "horror_addict",
    rating: 4,
    text: "A haunting atmosphere and stellar performances make this a must-watch for horror fans.",
    time: "7 h ago",
    comments: []
  },
  {
    id: 3,
    poster: originPoster,
    user: "historybuff",
    rating: 4,
    text: "A powerful and moving exploration of history and identity.",
    time: "1 d ago",
    comments: []
  },
  {
    id: 4,
    poster: spiderMan2TobyPoster,
    user: "spideyfan",
    rating: 4,
    text: "An exciting superhero adventure with heart, humor, and unforgettable action.",
    time: "2 d ago",
    comments: []
  },
  {
    id: 5,
    poster: theAvengersPoster,
    user: "marvelmaniac",
    rating: 5,
    text: "A spectacular superhero team-up that delivers action, humor, and heart.",
    time: "3 d ago",
    comments: []
  },
  {
    id: 6,
    poster: transformersPoster,
    user: "blockbusterfan",
    rating: 3,
    text: "Explosive action and impressive effects make for a fun blockbuster ride.",
    time: "4 d ago",
    comments: []
  },
  {
    id: 7,
    poster: spiderManAcrossTheSpiderVersePoster,
    user: "animationgeek",
    rating: 5,
    text: "A visually stunning and emotionally rich sequel that pushes animation boundaries.",
    time: "5 d ago",
    comments: []
  },
];

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
