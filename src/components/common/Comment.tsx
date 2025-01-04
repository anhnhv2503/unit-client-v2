import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createComment } from "@/services/commentService";
import { ChatBubbleOvalLeftIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { toast } from "sonner";
import { Textarea } from "../ui/textarea";

const Comment = ({
  commentCount,
  postId,
}: {
  commentCount?: number;
  postId?: string | undefined;
}) => {
  const [content, setContent] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleComment = async () => {
    try {
      setCommentLoading(true);
      const response = await createComment(postId, { content });
      if (response.status === 200) {
        setContent("");
        toast.success("Comment Posted");
        setCommentLoading(false);
        setIsOpen(false);
      }
    } catch (error) {
      setCommentLoading(true);
      console.error(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <div className="flex items-center">
          <ChatBubbleOvalLeftIcon className="h-6 w-6 mr-1 cursor-pointer" />
          {commentCount}
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Comment</DialogTitle>
        </DialogHeader>
        <DialogDescription></DialogDescription>
        <div className="">
          <div className=" items-center">
            <Textarea
              placeholder="Type your message here."
              className="w-full"
              onChange={(e) => setContent(e.target.value)}
              value={content}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleComment}
            disabled={!content || commentLoading}
          >
            Comment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Comment;
