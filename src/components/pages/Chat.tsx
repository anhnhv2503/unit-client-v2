import ChatWindow from "@/components/common/ChatWindow";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getCurrentChat } from "@/services/chatService";
import { UserProps } from "@/types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Chat = () => {
  const [chattingUsers, setChattingUsers] = useState<UserProps[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserProps>();
  const nav = useNavigate();

  const getChats = async () => {
    try {
      const response = await getCurrentChat();
      setChattingUsers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getChats();
  }, []);

  const handleSelectChat = (user: UserProps) => {
    setSelectedUser(user);
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
            {chattingUsers.map((user) => (
              <li
                key={user.id}
                className="flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
                onClick={() => {
                  handleSelectChat(user);
                  nav(`/chat`);
                }}
              >
                <Avatar className="w-10 h-10">
                  <AvatarImage
                    src={user.avatar || "/placeholder.svg"}
                    alt={user.firstName + " " + user.lastName}
                  />
                  <AvatarFallback>
                    {user.lastName.charAt(0) + " " + user.firstName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                    {user.firstName + " " + user.lastName}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </div>
      <div className="flex-1 flex flex-col pt-16 sm:pt-0 mt-10">
        {selectedUser ? (
          <div className="flex-1 flex justify-center px-4 py-6 overflow-y-auto">
            <ChatWindow user={selectedUser} />
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
