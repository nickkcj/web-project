import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import { FC, useState } from "react";
import { DialogFooter, DialogHeader } from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

interface AddCommentModalProps {
  /** controls Dialog open state from parent */
  open: boolean;
  setOpen: (o: boolean) => void;
  /** called with the new comment text */
  onSubmit: (text: string) => void;
}

const AddCommentModal: FC<AddCommentModalProps> = ({
  open,
  setOpen,
  onSubmit,
}) => {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (text.trim()) {
      onSubmit(text.trim());
      setText("");
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild /> {/* trigger handled by parent */}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add a comment</DialogTitle>
        </DialogHeader>

        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write something nice…"
          className="h-32"
        />

        <DialogFooter>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Post</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddCommentModal;
