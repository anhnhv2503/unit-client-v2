import { CommentProps } from "@/types";
import React from "react";
import { useNavigate } from "react-router-dom";

const Reply: React.FC<CommentProps> = ({
  id,
  content,
  createdAt,
  authorName,
  authorAvatar,
  authorId,
}) => {
  const nav = useNavigate();

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
  return (
    <div
      className="bg-white dark:bg-zinc-800 p-4 shadow border dark:border-b-gray-500 rounded-xl my-2"
      key={id}
    >
      <div className="flex items-top mb-2">
        <div className="flex-none w-10 h-10 mr-2">
          <img
            src={authorAvatar}
            alt="Profile picture of the second user"
            className="w-10 h-10 rounded-full mr-2"
          />
        </div>
        <div>
          <div
            className="font-semibold dark:text-white cursor-pointer"
            onClick={() => nav(`/user-profile/${authorId}`)}
          >
            <span className="hover:text-gray-400">{authorName} </span>
            <span className="text-sm text-gray-500 font-normal">
              {calculateTime(createdAt)}
            </span>
          </div>
          <div className="dark:text-white">{content}</div>
        </div>
      </div>
    </div>
  );
};

export default Reply;
