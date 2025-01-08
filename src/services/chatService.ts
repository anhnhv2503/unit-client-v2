import axiosInstance from "@/services/axiosClient";

export const getCurrentChat = async () => {
  return axiosInstance.get("chat/current-user/conversations");
};

export const getMessages = async (userId: number) => {
  return axiosInstance.get(`chat/conversation/${userId}`);
};

export const sendMessage = async (conversationId: number, content: string) => {
  return axiosInstance.post(`chat/send/message/${conversationId}`, {
    content: content,
  });
};
