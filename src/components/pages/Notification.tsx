import {
  acceptFollowRequest,
  removeFollowRequest,
} from "@/services/followService";
import {
  deleteNotification,
  getAllNotifications,
  isSeenNotification,
} from "@/services/notificationService";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import Loading from "../common/loading/Loading";
import { useWebSocket } from "../context/NotificationProvider";
import { Button } from "../ui/button";
interface NotificationProps {
  id: string; // Unique identifier (e.g., a UUID)
  isSeen: boolean;
  actionType: string;
  userName: string;
  postId?: string;
  userId?: string;
  pictureProfile?: string;
  createdAt: string; // ISO string for sorting
  metadata: {
    userName: string;
    profilePicture: string;
    lastestActionUserId: string;
  };
  ownerId: string;
  affectedObjectId: string;
}

const Notification = () => {
  const [notifications, setNotifications] = useState<NotificationProps[]>([]);
  const [loading, setLoading] = useState(false);
  const isPrivate = JSON.parse(localStorage.getItem("isPrivate")!);
  const nav = useNavigate();
  const { messages } = useWebSocket();

  const getAllNotification = async () => {
    setLoading(true);
    try {
      const res = await getAllNotifications();
      setNotifications(
        res.data.sort(
          (a: NotificationProps, b: NotificationProps) =>
            Math.abs(new Date(a.createdAt).getTime() - Date.now()) -
            Math.abs(new Date(b.createdAt).getTime() - Date.now())
        )
      );
      setLoading(false);
      // console.log(res.data);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  useEffect(() => {
    getAllNotification();
  }, []);

  console.log(notifications);

  const generateMessage = (
    actionType: string,
    userName: string
  ): JSX.Element => {
    const boldUserName = <span className="font-bold">{userName}</span>;

    switch (actionType) {
      case "CommentPost":
        return <span>{boldUserName} commented on your post.</span>;
      case "LikePost":
        return <span>{boldUserName} liked your post.</span>;
      case "ReplyComment":
        return <span>{boldUserName} replied to your comment.</span>;
      case "LikeComment":
        return <span>{boldUserName} liked your comment.</span>;
      case "FollowRequest":
        return <span>{boldUserName} has follow you.</span>;
      default:
        return <span>You have a new notification.</span>;
    }
  };

  // Listen for real-time WebSocket updates
  const generateUniqueId = (notification: any) => {
    const { actionType, affectedObjectId, ownerId, createdAt } = notification;
    return `${actionType}-${affectedObjectId}-${ownerId}-${createdAt}`;
  };

  useEffect(() => {
    if (messages.length > 0) {
      const newNotifications = messages.map((message) => {
        const { notification } = JSON.parse(message);
        const id = generateUniqueId(notification);

        return {
          ...notification,
          id, // Generated unique ID
          isNew: true, // Mark as new
        };
      });

      setNotifications((prev) => {
        const merged = [...newNotifications, ...prev];

        // Sort by `createdAt` (latest first)
        return merged.sort(
          (a, b) =>
            Math.abs(new Date(a.createdAt).getTime() - Date.now()) -
            Math.abs(new Date(b.createdAt).getTime() - Date.now())
        );
      });
    }
  }, [messages]);

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

  const handleIsSeenNotification = async (createdAt: string) => {
    try {
      await isSeenNotification(createdAt);
      getAllNotification();
    } catch (error) {
      console.error("Failed to mark notification as seen:", error);
    }
  };

  const handleAcceptFollowRequest = async (
    followerId: string,
    createdAt: string
  ) => {
    try {
      const res = await acceptFollowRequest(followerId);
      await deleteNotification(createdAt);

      getAllNotification();
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };

  const handleRemoveFollowRequest = async (
    followId: string,
    createdAt: string
  ) => {
    try {
      await removeFollowRequest(followId);
      await deleteNotification(createdAt);

      getAllNotification();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex flex-col items-center px-4 py-6 lg:px-8 min-h-screen bg-white dark:bg-black overflow-y-scroll no-scrollbar">
      <div className="w-full flex justify-center mt-3">
        <div className="max-w-2xl w-full">
          <div className="p-4">
            {loading ? (
              <Loading />
            ) : notifications.length > 0 ? (
              <ul role="list" className="divide-y divide-gray-200">
                {notifications.map((person) => (
                  <li
                    key={uuidv4()}
                    className="flex gap-x-4 py-5 cursor-pointer items-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (
                        person.actionType === "LikePost" ||
                        person.actionType === "CommentPost" ||
                        person.actionType === "ReplyComment" ||
                        person.actionType === "LikeComment"
                      ) {
                        nav(
                          `/post?postId=${person.affectedObjectId}&userId=${person.ownerId}`
                        );
                      } else {
                        nav(
                          `/user-profile/${person.metadata.lastestActionUserId}`
                        );
                      }
                      if (!person.isSeen)
                        handleIsSeenNotification(person.createdAt);
                    }}
                  >
                    {/* Avatar */}
                    <div className="relative flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16">
                      <img
                        src={person.metadata.profilePicture}
                        alt={person.metadata.userName}
                        className="w-full h-full rounded-full object-cover"
                      />
                      <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                        <span className="text-white text-xs font-bold">a</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex items-center">
                      <p
                        className={`${
                          person.isSeen
                            ? "mt-1 text-gray-500 dark:text-gray-300 text-xs sm:text-sm md:text-base"
                            : "text-sm font-bold"
                        } `}
                      >
                        {generateMessage(
                          person.actionType,
                          person.metadata.userName
                        )}
                        <span className="text-gray-500 ml-2 text-xs sm:text-sm">
                          {calculateTime(person.createdAt)}
                        </span>
                      </p>
                    </div>

                    {person.actionType === "FollowRequest" && isPrivate && (
                      <div className="ml-auto">
                        <span className="mr-1">
                          <Button
                            className="bg-blue-600 text-xs p-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAcceptFollowRequest(
                                person.metadata.lastestActionUserId,
                                person.createdAt
                              );
                            }}
                          >
                            Accepct
                          </Button>
                        </span>
                        <span>
                          <Button
                            className="text-xs p-1 mt-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveFollowRequest(
                                person.metadata.lastestActionUserId,
                                person.createdAt
                              );
                            }}
                          >
                            Remove
                          </Button>
                        </span>
                      </div>
                    )}

                    {!person.isSeen &&
                      person.actionType !== "FollowRequest" && (
                        <div
                          className="ml-auto 
                         w-4 h-4 bg-blue-500 rounded-full border-2 border-white
                      "
                        ></div>
                      )}
                  </li>
                ))}
              </ul>
            ) : (
              <div>
                <h2 className="text-lg font-semibold text-gray-500 text-center">
                  No notifications yet
                </h2>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;
