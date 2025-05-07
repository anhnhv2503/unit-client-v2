import axiosInstance from "@/services/axiosClient";

export const getAllNotifications = async () => {
  return axiosInstance.get("/notification/my-notifications");
};

export const deleteNotification = async (createdAt: string) => {
  return axiosInstance.delete(`/notification`, {
    data: { createdAt },
  });
};

export const isSeenNotification = async (createdAt: string) => {
  return axiosInstance.post(`/notification`, {
    createdAt,
  });
};

export const countUnseenNotification = async () => {
  return axiosInstance.get("/notification/unread");
};
