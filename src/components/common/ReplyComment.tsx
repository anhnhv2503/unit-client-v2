import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createReply, getRepliesByCommentId } from "@/services/commentService";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import React, { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface ReplyCommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  CommentId: string;
  Content: string;
  CreatedAt: string;
  AuthorUserName: string;
  AuthorId: string;
  AuthorProfilePicture: string;
  PostId: string;
}

interface RepliesResponse {
  AuthorUserName: string;
  AuthorId: string;
  AuthorProfilePicture: string;
  ReplyId: string;
  Content: string;
}

const ReplyComment: React.FC<ReplyCommentsModalProps> = ({
  isOpen,
  onClose,
  CommentId,
  Content,
  AuthorUserName,
  CreatedAt,
  AuthorId,
  AuthorProfilePicture,
  PostId,
}) => {
  const nav = useNavigate();
  const [replies, setReplies] = useState<RepliesResponse[]>([]);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const calculateTime = (date: string) => {
    const now = new Date();
    const postDate = new Date(date);
    const secondsAgo = Math.floor((now.getTime() - postDate.getTime()) / 1000);

    if (secondsAgo < 60) {
      return `${secondsAgo} seconds ago`;
    } else if (secondsAgo < 3600) {
      const minutes = Math.floor(secondsAgo / 60);
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else if (secondsAgo < 86400) {
      const hours = Math.floor(secondsAgo / 3600);
      return `${hours} hour${hours > 1 ? "s" : ""} `;
    } else if (secondsAgo < 2592000) {
      const days = Math.floor(secondsAgo / 86400);
      return `${days} day${days > 1 ? "s" : ""} `;
    } else if (secondsAgo < 31536000) {
      const months = Math.floor(secondsAgo / 2592000);
      return `${months} month${months > 1 ? "s" : ""} `;
    } else {
      const years = Math.floor(secondsAgo / 31536000);
      return `${years} year${years > 1 ? "s" : ""} `;
    }
  };

  const getReplies = async () => {
    try {
      const response = await getRepliesByCommentId(CommentId, PostId);
      setReplies(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      getReplies();
    }
  }, [isOpen]);

  const handleReplySubmit = async () => {
    try {
      setIsSubmitting(true);
      const response = await createReply(PostId, CommentId, {
        content,
      });
      if (response.status === 200) {
        setContent("");
        getReplies();
      }
      setIsSubmitting(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white dark:bg-zinc-800 p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
                  >
                    Replies
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
                <div className="mb-4">
                  <div className="flex items-top">
                    <img
                      src={AuthorProfilePicture}
                      alt="Profile"
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      <div
                        className="font-semibold cursor-pointer dark:text-white "
                        onClick={() => nav(`/user-profile/${AuthorId}`)}
                      >
                        {AuthorUserName}
                        <span className="ml-2 text-sm text-gray-500">
                          {calculateTime(CreatedAt)}
                        </span>
                      </div>
                      <p className="text-gray-700 dark:text-white">{Content}</p>
                    </div>
                  </div>
                </div>
                <div className="max-h-[calc(100vh-300px)] overflow-y-auto space-y-4">
                  {replies.length > 0 ? (
                    replies.map((reply) => (
                      <div
                        key={reply.ReplyId}
                        className="flex items-top bg-gray-50 dark:bg-zinc-800 p-4 rounded-lg border-l-4 border-gray-300 dark:border-gray-700"
                      >
                        <img
                          src={reply.AuthorProfilePicture}
                          alt="Reply User"
                          className="w-8 h-8 rounded-full mr-3"
                        />
                        <div>
                          <div
                            className="font-semibold cursor-pointer text-sm"
                            onClick={() =>
                              nav(`/user-profile/${reply.AuthorId}`)
                            }
                          >
                            {reply.AuthorUserName}
                          </div>
                          <p className="text-gray-600 dark:text-gray-300 text-sm">
                            {reply.Content}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center">No replies yet.</p>
                  )}
                </div>
                <div className="mt-4">
                  <div className="flex items-center space-x-3">
                    <Input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Write a reply..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                    />
                    <Button
                      onClick={handleReplySubmit}
                      className={`px-4 py-2 bg-black text-white rounded-lgn dark:bg-white dark:text-black hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed`}
                      disabled={!content.trim() || isSubmitting}
                    >
                      {isSubmitting ? "Posting..." : "Post"}
                    </Button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ReplyComment;
