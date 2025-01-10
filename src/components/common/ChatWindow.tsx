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
import { getMessages } from "@/services/chatService";
import { UserProps } from "@/types";
import { Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { over } from "stompjs";
import SockJS from "sockjs-client";

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
  const [isConnected, setIsConnected] = useState(false);
  const [stompClient, setStompClient] = useState<any>(null);

  const getMessagesInConversation = async (userId: number) => {
    try {
      // Fetch messages from the server
      const response = await getMessages(userId);
      setMessages(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const registerWebSocket = () => {
    let sock = new SockJS("http://localhost:8080/ws");
    let stomp = over(sock);
    stomp.connect({}, onConnected, onError);
    setStompClient(stomp);
  };

  const onConnected = () => {
    console.log("Connected to the chat server");
    setIsConnected(true);
    stompClient.subscribe("/topic/messages", onMessageReceived);
  };

  const onMessageReceived = (payload: any) => {
    const message = JSON.parse(payload.body);
    console.log("Message received: >>", message);
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const onError = (error: any) => {
    console.error("Error connecting to the chat server: >>", error);
  };

  useEffect(() => {
    if (user) {
      getMessagesInConversation(user.id);
      registerWebSocket();
    }
  }, [user]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async (recipientId: number, content: string) => {
    const newMessage = {
      recipientId: recipientId,
      content: content,
    };
    stompClient.send("/app/chat", {}, JSON.stringify(newMessage));
    setNewMessage("");
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

  return (
    <Card className="w-full h-[90vh] sm:h-[900px] flex flex-col">
      <CardHeader className="relative flex items-center gap-3 p-4">
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
