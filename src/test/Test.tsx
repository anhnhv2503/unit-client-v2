import { Button } from "@/components/ui/button";
import { Client } from "@stomp/stompjs";
import { useEffect } from "react";
const Test = () => {
  const connectSocket = (onMessageReceived: any) => {
    const client: any = new Client({
      brokerURL: "ws://localhost:8080/ws",
      connectHeaders: {},
      debug: (str) => console.log(str),
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("Connected notification");
        client.subscribe(`/user/notification/topic/notify`, (message: any) => {
          try {
            const parsedMessage = JSON.parse(message.body);
            console.log("Body >>>>", parsedMessage);
            onMessageReceived(parsedMessage);
          } catch (error) {
            console.error(error);
            console.log(message.body);
          }
        });
      },
      onDisconnect: () => {
        console.log("Disconnected");
      },
    });
    client.activate();
  };

  useEffect(() => {
    connectSocket((message: any) => {
      console.log("Notification >>>>", message);
    });
  }, []);

  const handleNotify = () => {
    const client: any = new Client({
      brokerURL: "ws://localhost:8080/ws",
      connectHeaders: {},
      debug: (str) => console.log(str),
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("Connected button");
        client.publish({
          destination: "/app/notify",
        });
      },
      onDisconnect: () => {
        console.log("Disconnected");
      },
    });
    client.activate();
  };

  return (
    <div>
      <Button onClick={() => handleNotify()}>Notification</Button>
    </div>
  );
};

export default Test;
