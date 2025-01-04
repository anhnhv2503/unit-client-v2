import axiosInstance from "@/services/axiosClient";

export const getFollowers = async (userId: string) => {
  return axiosInstance.get(
    `user/p/${userId}?Followers=true&include=Followers&size=10&pageNumber=1`
  );
};

export const getFollowing = async (userId: string) => {
  return axiosInstance.get(
    `user/p/${userId}?Following=true&include=Following&size=10&pageNumber=1`
  );
};

export const unfollowUser = async (userId: string) => {
  const formData = new FormData();
  formData.append("follow", userId);
  return axiosInstance.post("user", formData);
};

export const acceptFollowRequest = async (followerId: string) => {
  const formData = new FormData();
  formData.append("follower", followerId);
  formData.append("IsAcceptFollower", "true");
  return axiosInstance.post("user", formData);
};

export const removeFollowRequest = async (followerId: string) => {
  const formData = new FormData();
  formData.append("follow", followerId);
  return axiosInstance.post("user", formData);
};

export const getFollowRequests = async (userId: string) => {
  return axiosInstance.get(`user/p/${userId}?fields=FollowRequests`);
};
