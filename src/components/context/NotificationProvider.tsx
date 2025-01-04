import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

type WebSocketContextType = {
  sendMessage: (message: string) => void;
  isConnected: boolean;
  messages: string[];
  connect: () => void;
  disconnect: () => void;
  handleLogin: (loggedInUserId: string) => void;
  handleLogout: () => void;
  clearNotifications: () => void;
};

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};

const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const socketRef = useRef<WebSocket | null>(null);
  const webSocketURL =
    "wss://v3jhk6p1a6.execute-api.ap-southeast-1.amazonaws.com/develop/";

  // Retrieve `userId` immediately
  const userId = useRef<string | null>(null);
  useEffect(() => {
    const storedUserId = JSON.parse(localStorage.getItem("user_id") || "null");
    if (storedUserId) {
      userId.current = storedUserId;
      connect();
    }
    return () => {
      disconnect(); // Cleanup on unmount
    };
  }, []);

  const connect = () => {
    if (!userId.current || socketRef.current) return; // Skip if no `userId` or already connected

    const socket = new WebSocket(`${webSocketURL}?userId=${userId.current}`);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("WebSocket connected");
      setIsConnected(true);
    };

    socket.onmessage = (event) => {
      console.log("WebSocket message received:", event.data);
      const data = JSON.parse(event.data);
      setMessages((prev) => [...prev, data]);
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
      setIsConnected(false);
      socketRef.current = null;
    };
  };

  const disconnect = () => {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
  };

  const sendMessage = (message: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.send(message);
    } else {
      console.warn("WebSocket is not connected");
    }
  };

  const handleLogin = (loggedInUserId: string) => {
    userId.current = loggedInUserId; // Set the userId
    localStorage.setItem("user_id", JSON.stringify(loggedInUserId)); // Store userId in localStorage
    connect(); // Connect to WebSocket
  };

  const handleLogout = () => {
    disconnect(); // Disconnect WebSocket
    userId.current = null; // Clear userId
    localStorage.removeItem("user_id"); // Remove from localStorage
  };

  const clearNotifications = () => {
    setMessages([]); // Assuming `messages` is managed via state
  };

  // Automatically connect when provider mounts
  useEffect(() => {
    if (userId.current) {
      connect();
    }
    return () => {
      disconnect(); // Cleanup on unmount
    };
  }, []); // Only run on mount

  return (
    <WebSocketContext.Provider
      value={{
        connect,
        sendMessage,
        isConnected,
        messages,
        disconnect,
        handleLogin,
        handleLogout,
        clearNotifications,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketProvider;
