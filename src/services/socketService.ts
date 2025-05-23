import { Client } from "@stomp/stompjs";

const connectSocket = (onMessageReceived: any) => {
  const client: any = new Client({
    brokerURL: "ws://localhost:8080/ws",
    connectHeaders: {},

    reconnectDelay: 5000,
    onConnect: () => {
      console.log("Connected");
      client.subscribe(`/user/chat/queue/messages`, (message: any) => {
        try {
          const parsedMessage = JSON.parse(message.body);
          onMessageReceived(parsedMessage);
        } catch (error) {
          console.error(error);
          onMessageReceived(message.body);
        }
      });
    },
    onDisconnect: () => {
      console.log("Disconnected");
    },
  });
  client.activate();
};

export default connectSocket;
