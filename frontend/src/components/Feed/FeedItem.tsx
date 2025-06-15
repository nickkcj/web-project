import { FC, useState } from "react";
import { Heart, MessageCircle, Star } from "lucide-react";
import { motion } from "framer-motion";
import CommentFeed, { Comment } from "./CommentFeed";
import AddCommentModal from "./AddCommentModal";

export interface FeedItemProps {
  id: number;
  poster: string;
  user: string;
  rating: number;
  text: string;
  time: string;
  comments: Comment[];
}

const FeedItem: FC<FeedItemProps> = ({
  poster,
  user,
  rating,
  text,
  time,
  comments: initialComments,
}) => {
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [openModal, setOpenModal] = useState(false);

  /* ---- actions -------------------------------------------------- */
  const toggleLike = () => setLiked((l) => !l);

  const addComment = (content: string) =>
    setComments((prev) => [
      { id: Date.now(), user: "you", text: content }, // new comment on TOP
      ...prev,
    ]);

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="rounded-2xl bg-slate-900 p-6 shadow-lg space-y-4 text-left"
    >
      {/* ── header ──────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 text-sm">
        <span className="font-semibold">{user}</span>
        <span className="text-slate-500">· {time}</span>
        <span className="ml-auto flex items-center gap-1 text-amber-300">
          <Star size={16} /> {rating}/5
        </span>
      </div>

      {/* ── body ───────────────────────────────────────────────── */}
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

      {/* ── comments ───────────────────────────────────────────── */}
      <CommentFeed comments={comments} />

      {/* ── actions ────────────────────────────────────────────── */}
      <div className="flex gap-6 pt-2 border-t border-slate-800 text-slate-400">
        {/* LIKE -------------------------------------------------- */}
        <button
          onClick={toggleLike}
          className={`flex items-center gap-1 ${
            liked ? "text-red-500" : "hover:text-amber-400"
          }`}
        >
          <motion.span
            animate={{ scale: liked ? [1, 1.35, 1] : 1 }}
            // tween by default
            transition={{ duration: 0.35 }}
          >
            <Heart
              size={18}
              fill={liked ? "#ef4444" : "none"}
              className={liked ? "text-red-500" : ""}
            />
          </motion.span>
          Like
        </button>

        {/* COMMENT --------------------------------------------- */}
        <button
          onClick={() => setOpenModal(true)}
          className="flex items-center gap-1 hover:text-amber-400"
        >
          <MessageCircle size={18} /> Comment
        </button>
      </div>

      {/* modal for new comment */}
      <AddCommentModal
        open={openModal}
        setOpen={setOpenModal}
        onSubmit={addComment}
      />
    </motion.article>
  );
};

export default FeedItem;
