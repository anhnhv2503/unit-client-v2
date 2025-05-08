import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getAllNotifications,
  markAsSeen,
} from "@/services/notificationService";
import { NotificationProps } from "@/types";
import { calculateTime } from "@/utils/format";
import { Bell, Heart, MessageSquare, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Notification = () => {
  const [notifications, setNotifications] = useState<NotificationProps[]>([]);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await getAllNotifications();
      setNotifications(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "LIKE":
        return <Heart className="h-5 w-5 text-rose-500" />;
      case "COMMENT":
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
      default:
        return <Bell className="h-5 w-5 text-amber-500" />;
    }
  };

  const handleSeenNotification = async (id: number) => {
    try {
      await markAsSeen(id);
    } catch (error) {
      console.error("Error marking notification as seen:", error);
    }
  };

  return (
    <div className="flex flex-col items-center px-4 py-6 lg:px-8 min-h-screen bg-white dark:bg-black overflow-y-scroll no-scrollbar">
      <div className="w-full flex justify-center mt-3">
        <div className="max-w-2xl w-full">
          <div className="flex items-center justify-between mb-6 mt-10"></div>

          {loading ? (
            // Loading skeletons
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Card key={i} className="p-4 flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </Card>
              ))}
            </div>
          ) : notifications.length > 0 ? (
            // Notification list
            <div className="space-y-3">
              {notifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`flex items-start p-4 ${
                    !notification.read ? "border-l-4 border-l-green-500" : ""
                  }`}
                >
                  <div className="flex-shrink-0 mr-4">
                    <Avatar>
                      <AvatarImage
                        src={notification.interactorAvatar}
                        alt={`${notification.interactorName}'s avatar`}
                      />
                      <AvatarFallback>
                        {notification.interactorName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() => {
                      handleSeenNotification(notification.id);
                      nav(`/post?postId=${notification.postId}`);
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm dark:text-white">
                          <span className="text-gray-600 dark:text-gray-300 font-bold">
                            {notification.content}:{" "}
                          </span>
                          <span className="">{notification.postTitle}</span>
                        </p>

                        <div className="flex items-center mt-1.5 gap-2">
                          <div className="flex items-center">
                            {getNotificationIcon(notification.type)}
                            <span className="text-xs ml-1 capitalize text-gray-500 dark:text-gray-400">
                              {notification.type.toLowerCase()}
                            </span>
                          </div>
                          <span className="text-xs ml-1 capitalize text-gray-500 dark:text-gray-400">
                            {calculateTime(notification.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="flex flex-col items-center justify-center py-16 text-center">
              <Bell className="h-12 w-12 text-gray-400 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-medium dark:text-white">
                No notifications
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mt-2">
                When you receive notifications, they'll appear here.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notification;
