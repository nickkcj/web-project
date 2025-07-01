import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import { FC, useState } from "react";
import { DialogFooter, DialogHeader } from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

interface AddCommentModalProps {
  open: boolean;
  setOpen: (o: boolean) => void;
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
          onChange={(e) => setText(e.target.value.slice(0, 1000))}
          placeholder="Write something nice…"
          className="h-32"
          maxLength={1000}
        />
        <div className="text-right text-xs text-slate-400 mt-1">
          {text.length}/1000
        </div>

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
