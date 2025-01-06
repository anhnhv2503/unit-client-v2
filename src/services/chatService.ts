import axiosInstance from "@/services/axiosClient";

export const getCurrentChat = async () => {
  return axiosInstance.get("chat/current-user/conversations");
};

export const getMessages = async (userId: number) => {
  return axiosInstance.get(`chat/conversation/${userId}`);
};
