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
import { getOtherUserProfile } from "@/services/authService";
import { getMessages } from "@/services/chatService";
import { UserProps } from "@/types";
import { ArrowLeft, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

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

const ChatWindow = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [currentUser, setCurrentUser] = useState<UserProps>();
  const userId = useParams().userId;
  const nav = useNavigate();
  const [stompClient, setStompClient] = useState<any>();

  useEffect(() => {
    const sock = new SockJS(`http://localhost:8080/ws`);
    const stomp = Stomp.over(sock);
    setStompClient(stomp);

    stomp.connect({}, onConnect, onError);
  }, []);

  const onConnect = () => {
    console.log("Connected to WebSocket >>D");
  };

  const onError = (error: any) => {
    console.warn("MẸ KEEP LẠI LỖI! 3==D", error);
  };

  const getMessagesInConversation = async (userId: string) => {
    try {
      const response = await getMessages(userId);
      setMessages(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getCurrentUser = async () => {
    try {
      const response = await getOtherUserProfile(userId!);
      setCurrentUser(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getMessagesInConversation(userId!);
    getCurrentUser();
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = (recipientId: string, content: string) => {
    const newMessage = {
      recipientId,
      content,
    };
    toast("Sending message..." + JSON.stringify(newMessage));
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <Card className="flex flex-col h-[calc(100vh-4rem)] max-w-3xl mx-auto mt-20">
      <div className="">
        <Button
          variant={"outline"}
          onClick={() => nav(-1)}
          className="p-2 border rounded-full"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
      </div>
      <CardHeader className="flex items-center justify-center p-4 space-y-0">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage
              src={currentUser?.avatar || "/placeholder.svg"}
              alt={`${currentUser?.firstName} ${currentUser?.lastName}`}
            />
            <AvatarFallback>
              {currentUser?.lastName.charAt(0)}
              {currentUser?.firstName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-lg font-semibold">
              {currentUser?.firstName} {currentUser?.lastName}
            </h2>
            <p className="text-sm text-muted-foreground">Online</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-grow overflow-hidden p-4">
        <ScrollArea className="h-full pr-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex mb-4 ${
                message.senderName === "You" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3 ${
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
          <div ref={messagesEndRef} />
        </ScrollArea>
      </CardContent>

      <CardFooter className="p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (newMessage.trim()) {
              handleSendMessage(userId!, newMessage);
              setNewMessage("");
            }
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
