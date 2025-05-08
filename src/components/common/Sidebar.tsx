import ModePopover from "@/components/common/ModePopover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { playPrimarySound } from "@/utils/audio";
import { countUnseenNotification } from "@/services/notificationService";
import {
  BellIcon,
  ChatBubbleOvalLeftIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { Client } from "@stomp/stompjs";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const nav = useNavigate();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState("/");
  const [notificationCount, setNotificationCount] = useState(0);

  const decodedToken = jwtDecode<{ id: string }>(
    localStorage.getItem("accessToken")!
  );
  const currentUserId = decodedToken.id;

  useEffect(() => {
    setActiveItem(location.pathname);
  }, [location]);

  const fetchNotificationCount = async () => {
    try {
      const response = await countUnseenNotification();
      setNotificationCount(response.data);
    } catch (error) {
      console.error("Error fetching notification count:", error);
    }
  };

  useEffect(() => {
    const connectSocket = (callback: any) => {
      const client = new Client({
        brokerURL: "ws://localhost:8080/ws",
        connectHeaders: {},
        reconnectDelay: 5000,
        onConnect: () => {
          client.subscribe(
            `/topic/unread/${currentUserId}`,
            (newNotification: any) => {
              try {
                callback(newNotification.body);
              } catch (error) {
                console.error("Error parsing notification:", error);
              }
            }
          );
        },
        onDisconnect: () => {
          console.log("Disconnected from WebSocket");
        },
      });
      client.activate();
      return client;
    };
    const handleData = (data: any) => {
      setNotificationCount(data);
      playPrimarySound();
    };

    const client = connectSocket(handleData);
    fetchNotificationCount();
    return () => {
      if (client && client.connected) {
        client.deactivate();
      }
    };
  }, []);

  const navItems = [
    { path: "/", icon: HomeIcon, label: "Home" },
    { path: "/search", icon: MagnifyingGlassIcon, label: "Search" },
    {
      path: "/notify",
      icon: BellIcon,
      label: "Notifications",
      badge: notificationCount > 0 ? notificationCount : undefined,
    },
    {
      path: `/user-profile/${currentUserId}`,
      icon: UserIcon,
      label: "Profile",
    },
    { path: "/chat", icon: ChatBubbleOvalLeftIcon, label: "Messages" },
  ];

  return (
    <div
      className={cn(
        "fixed sm:h-screen h-16 z-10 transition-all duration-300",
        "dark:text-white text-black",
        "sm:left-0 bottom-0 w-full sm:w-16",
        "flex sm:flex-col flex-row",
        "dark:bg-neutral-950 bg-white"
      )}
    >
      {/* Main navigation */}
      <TooltipProvider delayDuration={300}>
        <ul
          className="flex sm:flex-col flex-row sm:space-y-2 space-y-0 sm:space-x-0 space-x-1 
                       sm:items-center items-center justify-center w-full sm:mt-auto py-1 px-1"
        >
          {navItems.map((item) => (
            <Tooltip key={item.path}>
              <TooltipTrigger asChild>
                <li
                  onClick={() => nav(item.path)}
                  className={cn(
                    "w-full rounded-lg transition-all duration-300 cursor-pointer",
                    activeItem === item.path
                      ? "bg-gray-100 dark:text-white text-black dark:bg-neutral-900"
                      : "hover:bg-neutral-200 dark:hover:bg-neutral-800",
                    "relative"
                  )}
                >
                  <div className="flex items-center justify-center p-3 sm:p-4">
                    <item.icon
                      className={cn(
                        "w-7 h-7",
                        activeItem === item.path
                          ? "text-gray-500 dark:text-gray-300"
                          : ""
                      )}
                    />

                    {item.badge && (
                      <span
                        className="absolute top-1 right-1 bg-red-500 text-white text-xs 
                                       font-bold rounded-full flex items-center justify-center 
                                       min-w-5 h-5 px-1 transform -translate-y-1 translate-x-1"
                      >
                        {item.badge > 99 ? "99+" : item.badge}
                      </span>
                    )}
                  </div>

                  {activeItem === item.path && (
                    <div
                      className="absolute left-0 sm:left-0 sm:top-0 bottom-0 sm:h-full h-1 sm:w-1 w-full
                              bg-gray-300 rounded-full"
                    />
                  )}
                </li>
              </TooltipTrigger>
              <TooltipContent side="right" className="sm:block hidden">
                <p>{item.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </ul>
      </TooltipProvider>

      {/* Bottom settings/theme section */}
      <ul className="hidden sm:flex sm:flex-col sm:space-y-4 sm:items-center sm:mb-4 sm:mt-auto">
        <li className="p-2 sm:p-4 hover:bg-gray-300 dark:hover:bg-neutral-800 hover:text-zinc-800 dark:hover:text-white rounded-lg transition-all duration-300">
          <ModePopover />
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
