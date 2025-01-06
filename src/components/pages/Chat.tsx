import ChatWindow from "@/components/common/ChatWindow";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const users = [
  { id: 1, name: "Hưng", status: "Online", avatar: "/bob-avatar.svg" },
  { id: 2, name: "Tân", status: "Offline", avatar: "/charlie-avatar.svg" },
  { id: 3, name: "Trung", status: "Online", avatar: "/dave-avatar.svg" },
  { id: 4, name: "Trọng", status: "Offline", avatar: "/eve-avatar.svg" },
  { id: 5, name: "Sinh", status: "Online", avatar: "/alice-avatar.svg" },
];
const Chat = () => {
  const [selectedUser, setSelectedUser] = useState("");
  const nav = useNavigate();
  const [params] = useSearchParams();
  const chatId = params.get("chatId");
  console.log(chatId);

  const handleSelectChat = ({ userName }: { userName: string }) => {
    setSelectedUser(userName);
  };

  return (
    <div className="flex flex-col sm:flex-row min-h-screen dark:bg-black bg-white overflow-hidden">
      <div className="hidden sm:block sm:w-16"></div>
      <div className="sm:w-96 w-full bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-900 flex flex-col pt-16 sm:pt-0">
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
            Chats
          </h2>
        </div>
        <ScrollArea className="flex-grow">
          <ul>
            {users.map((user) => (
              <li
                key={user.id}
                className="flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
                onClick={() => {
                  handleSelectChat({ userName: user.name });
                  nav(`/chat?chatId=${user.id}`);
                }}
              >
                <Avatar className="w-10 h-10">
                  <AvatarImage
                    src={user.avatar || "/placeholder.svg"}
                    alt={user.name}
                  />
                  <AvatarFallback>{user.name[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user.status}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </div>
      <div className="flex-1 flex flex-col pt-16 sm:pt-0 mt-10">
        {chatId ? (
          <div className="flex-1 flex justify-center px-4 py-6 overflow-y-auto">
            <ChatWindow userName={selectedUser} />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Select a chat to start messaging.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
