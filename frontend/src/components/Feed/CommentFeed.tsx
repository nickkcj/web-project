import { FC, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface Comment {
  id: number;
  user: string;
  text: string;
}

/**
 * Shows up to `previewCount` comments collapsed,
 * with an expandable “View all n comments” link.
 */
interface CommentFeedProps {
  comments: Comment[];
  previewCount?: number;
}

const CommentFeed: FC<CommentFeedProps> = ({ comments, previewCount = 2 }) => {
  const [expanded, setExpanded] = useState(false);
  const shown = expanded ? comments : comments.slice(0, previewCount);

  return (
    <div className="space-y-1 text-sm">
      {/* toggle link */}
      {comments.length > previewCount && (
        <button
          onClick={() => setExpanded((e) => !e)}
          className="text-slate-400 hover:text-slate-200"
        >
          {expanded
            ? "Hide comments"
            : `View all ${comments.length} comments`}
        </button>
      )}

      {/* comments list */}
      <AnimatePresence initial={false}>
        {shown.map((c) => (
          <motion.p
            key={c.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="text-slate-300"
          >
            <span className="font-medium mr-2">{c.user}:</span>
            {c.text}
          </motion.p>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default CommentFeed;
