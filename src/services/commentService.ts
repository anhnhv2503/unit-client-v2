import axiosInstance from "@/services/axiosClient";

export const getCommentsByPostId = async (
  postId: string,
  pageParam: number
) => {
  const token = JSON.parse(localStorage.getItem("accessToken") || "{}");
  return axiosInstance.get(
    `post/${postId}/comments?orderBy=createdAt desc&pageNumber=${pageParam}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const createComment = async (postId: string | undefined, data: any) => {
  const token = JSON.parse(localStorage.getItem("accessToken") || "{}");
  return axiosInstance.post(`post/${postId}/comment`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getRepliesByCommentId = async (
  commentId: string,
  postId: string
) => {
  const token = JSON.parse(localStorage.getItem("accessToken") || "{}");
  return axiosInstance.get(`post/${postId}/comment/${commentId}/replies`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createReply = async (
  postId: string,
  commentId: string,
  data: any
) => {
  const token = JSON.parse(localStorage.getItem("accessToken") || "{}");
  return axiosInstance.post(`post/${postId}/comment/${commentId}/reply`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
