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
import connectSocket from "@/services/socketService";
import { UserProps } from "@/types";
import { Client } from "@stomp/stompjs";
import { jwtDecode } from "jwt-decode";
import { ArrowLeft, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";

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
  const decodedToken = jwtDecode<{ id: number }>(
    localStorage.getItem("accessToken")!
  );
  const senderId = decodedToken.id;

  useEffect(() => {
    connectSocket((message: any) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
  }, [userId]);

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
    const client: any = new Client({
      brokerURL: "ws://localhost:8080/ws",
      connectHeaders: {},
      debug: (str) => console.log(str),
      reconnectDelay: 5000,
      onConnect: () => {
        client.publish({
          destination: "/app/chat",
          body: JSON.stringify({
            senderId,
            recipientId,
            content,
          }),
        });
      },
      onDisconnect: () => {
        console.log("Disconnected");
      },
    });
    client.activate();
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const shouldShowTimestamp = (index: number) => {
    if (index === 0) return true; // Always show timestamp for first message
    const prevMessageTime = moment(messages[index - 1].createdAt);
    const currentMessageTime = moment(messages[index].createdAt);
    return currentMessageTime.diff(prevMessageTime, "hours") >= 1;
  };

  return (
    <Card className="flex flex-col h-[calc(100vh-4rem)] max-w-3xl mx-auto mt-20">
      <div className="">
        <Button variant={"ghost"} onClick={() => nav(-1)} className="p-2">
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
          {messages.map((message, index) => (
            <div key={message.id} className="flex flex-col">
              {/* Show timestamp if message is 1 hour apart */}
              {shouldShowTimestamp(index) && (
                <div className="text-center text-gray-500 text-sm my-2">
                  {moment(message.createdAt).format("h:mm A")}
                </div>
              )}

              <div
                className={`flex mb-4 ${
                  message.senderId == senderId ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 ${
                    message.senderId == senderId
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs text-gray-500">
                    {moment(message.createdAt).format("YYYY-MM-DD, h:mm:ss A")}
                  </p>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
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
