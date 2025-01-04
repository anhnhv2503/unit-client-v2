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
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Message = {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
};

const ChatWindow = ({ userName }: { userName: string }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "Alice",
      content: "Hey, how are you?",
      timestamp: "10:00 AM",
    },
    {
      id: 2,
      sender: "You",
      content: "Im good, thanks! How about you?",
      timestamp: "10:02 AM",
    },
    {
      id: 3,
      sender: "Alice",
      content: "Doing great! Excited about the new UNIT app features!",
      timestamp: "10:05 AM",
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg: Message = {
        id: messages.length + 1,
        sender: "You",
        content: newMessage.trim(),
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages([...messages, newMsg]);
      setNewMessage("");
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

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
              src="/placeholder.svg?height=40&width=40"
              alt={userName}
            />
            <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-lg font-semibold">{userName}</h2>
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
                message.sender === "You" ? "justify-end mr-5" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[70%] rounded-lg p-3 ${
                  message.sender === "You"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs mt-1 opacity-70">{message.timestamp}</p>
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
            handleSendMessage();
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
