import { FC, useState, useEffect } from "react";
import { Heart, MessageCircle, Star } from "lucide-react";
import { motion } from "framer-motion";
import CommentFeed, { Comment } from "./CommentFeed";
import AddCommentModal from "./AddCommentModal";
import services from '../../services/index';
import {useNavigate} from "react-router-dom";

export interface FeedItemProps {
  id: number;
  poster: string;
  user: string;
  userId: string;
  rating: number;
  text: string;
  time: string;
  comments: Comment[];
  currentUser?: { id: string | number; name: string } | null;
}

const FeedItem: FC<FeedItemProps> = ({
  id,
  poster,
  user,
  userId,
  rating,
  text,
  time,
  comments: initialComments,
  currentUser,
}) => {
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [openModal, setOpenModal] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    if (currentUser) {
      services.hasUserLikedReview(id).then(res => {
        if (mounted) setLiked(!!res.hasLiked);
      }).catch(() => {});
    }
    services.getLikeCount(id).then(res => {
      if (mounted) setLikeCount(res.count ?? 0);
    }).catch(() => {});
    return () => { mounted = false; };
  }, [id, currentUser]);

  const toggleLike = async () => {
    if (likeLoading) return;
    setLikeLoading(true);
    setLiked((l) => !l);
    setLikeCount((c) => liked ? c - 1 : c + 1);
    try {
      const res = await services.toggleLike(id);
      setLiked(res.liked);
      const likeRes = await services.getLikeCount(id);
      setLikeCount(likeRes.count ?? 0);
    } catch (err) {
      setLiked((l) => !l);
      setLikeCount((c) => liked ? c + 1 : c - 1);
    } finally {
      setLikeLoading(false);
    }
  };

  const addComment = async (content: string) => {
    try {
      const newComment = await services.createComment(id, content);
      setComments((prev) => [
        {
          id: newComment.id || Date.now(),
          user: (currentUser && newComment.user?.id === currentUser.id) ? 'you' : (newComment.user?.name || 'you'),
          text: newComment.content || content,
        },
        ...prev,
      ]);
    } catch (err) {
    }
  };

  const displayUser = currentUser && (currentUser.name === user) ? 'you' : user;

  if (!poster || !user) {
    return (
      <div className="flex items-center justify-center min-h-[180px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-slate-300 text-base">Carregando review...</span>
        </div>
      </div>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="rounded-2xl bg-slate-900 p-6 shadow-lg space-y-4 text-left"
    >
        <div className="flex items-center gap-2 text-sm">
            <div
                className="flex items-center gap-2 cursor-pointer group"
                onClick={() => navigate(`/user/${userId}`)}
                title="Ver perfil">
                <div
                    className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0">
                    {user.charAt(0).toUpperCase()}
                </div>
                <span className="font-semibold text-white group-hover:underline">
                    {displayUser}
                </span>
            </div>
          <span className="text-slate-500">· {time}</span>
        <span className="ml-auto flex items-center gap-1 text-amber-300">
          <Star size={16} /> {rating}/5
        </span>
      </div>

      <section>
        <img
          src={poster}
          alt={`Poster for review by ${user}`}
          className="hidden sm:block float-left w-24 h-36 mr-4 mb-2 rounded-md object-cover"
        />
        <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
          {text}
        </p>
        <div className="clear-both" />
      </section>

      <CommentFeed comments={comments} currentUser={currentUser} />

      <div className="flex gap-6 pt-2 border-t border-slate-800 text-slate-400">
        <button
          onClick={toggleLike}
          className={`flex items-center gap-1 ${
            liked ? "text-red-500" : "hover:text-amber-400"
          }`}
        >
          <motion.span
            animate={{ scale: liked ? [1, 1.35, 1] : 1 }}
            transition={{ duration: 0.35 }}
          >
            <Heart
              size={18}
              fill={liked ? "#ef4444" : "none"}
              className={liked ? "text-red-500" : ""}
            />
          </motion.span>
          Like
          <span className="ml-2 text-xs text-slate-400 font-semibold">{likeCount}</span>
        </button>

        <button
          onClick={() => setOpenModal(true)}
          className="flex items-center gap-1 hover:text-amber-400"
        >
          <MessageCircle size={18} /> Comment
          <span className="mr-2 text-xs text-slate-400 font-semibold">{comments.length}</span>
        </button>
      </div>

      <AddCommentModal
        open={openModal}
        setOpen={setOpenModal}
        onSubmit={addComment}
      />
    </motion.article>
  );
};

export default FeedItem;
