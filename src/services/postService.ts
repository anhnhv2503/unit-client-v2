import axiosInstance from "@/services/axiosClient";

export const getPosts = async (pageParam: number) => {
  const token = JSON.parse(localStorage.getItem("accessToken") || "{}");
  return axiosInstance.get(`/posts/all?page=${pageParam}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createPost = async (data: object) => {
  const token = JSON.parse(localStorage.getItem("accessToken") || "{}");
  return axiosInstance.post("/post", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const refreshTokens = async () => {
  const refreshToken = JSON.parse(localStorage.getItem("refreshToken")!);
  return axiosInstance.post("/auth/refresh-token", {
    refreshToken: refreshToken,
  });
};

export const getPostByUserId = async (userId: string, pageParam: number) => {
  const token = JSON.parse(localStorage.getItem("accessToken") || "{}");
  return axiosInstance.get(
    `/post?userId=${userId}&size=10&pageNumber=${pageParam}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const getPostDetail = async (postId: string, userId: string) => {
  const token = JSON.parse(localStorage.getItem("accessToken") || "{}");
  return axiosInstance.get(`/post?postId=${postId}&userId=${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const likeOrUnlikePost = async (
  postId: string,
  userId: string,
  like: boolean
) => {
  return axiosInstance.post(`/post/${postId}`, {
    userId: userId,
    like: like,
  });
};

export const getLikeOfPost = async (postId: string) => {
  return axiosInstance.get(`/post?postId=${postId}&LikeList=true`);
};
