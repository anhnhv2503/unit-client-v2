import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getMessages, sendMessage } from "@/services/chatService";
import { UserProps } from "@/types";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Message = {
  id: number;
  conversationId: string;
  senderId: number;
  senderName: string;
  senderAvatar: string;
  content: string;
  createdAt: string;
  mediaUrl: string;
};

const ChatWindow = ({ user }: { user: UserProps }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const getMessagesInConversation = async (userId: number) => {
    try {
      // Fetch messages from the server
      const response = await getMessages(userId);
      setMessages(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (user) {
      getMessagesInConversation(user.id);
    }
  }, [user]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async (recipientId: number, content: string) => {
    if (newMessage.trim()) {
      try {
        await sendMessage(recipientId, content);
      } catch (error) {
        console.error(error);
      }
      getMessagesInConversation(recipientId);
      setNewMessage("");
    }
    // console.log(">>>", recipientId);
    // console.log(">>>", content);
  };

  return (
    <Card className="w-full h-[80vh] sm:h-[820px] flex flex-col">
      <CardHeader className="relative flex items-center gap-3 p-4">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 left-2 flex items-center justify-center"
        >
          <ChevronLeftIcon className="h-5 w-5" />
          <span className="sr-only">Go Back</span>
        </Button>
        <div className="flex flex-row items-center gap-3 mx-auto">
          <Avatar>
            <AvatarImage
              src={user.avatar || "/placeholder.svg"}
              alt={user.firstName + " " + user.lastName}
            />
            <AvatarFallback>
              {user.lastName.charAt(0) + " " + user.firstName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-lg font-semibold">
              {user.firstName + " " + user.lastName}
            </h2>
            <p className="text-sm text-muted-foreground">Online</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-grow overflow-hidden p-4">
        <ScrollArea className="h-full">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex mb-4 ${
                message.senderName === "You"
                  ? "justify-end mr-5"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[70%] rounded-3xl p-3 ${
                  message.senderName === "You"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs mt-1 opacity-70">{message.createdAt}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef}></div>
        </ScrollArea>
      </CardContent>

      <CardFooter className="p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(user.id, newMessage);
          }}
          className="flex w-full items-center space-x-2"
        >
          <Input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-grow"
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default ChatWindow;
