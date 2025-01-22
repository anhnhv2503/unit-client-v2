import EditProfile from "@/components/common/EditProfile";
import Loading from "@/components/common/loading/Loading";
import { Post } from "@/components/common/Post";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getOtherUserProfile } from "@/services/authService";
import { createChatIfNotExists } from "@/services/chatService";
import { getPostByUserId } from "@/services/postService";
import { PostProps, UserProfileProps } from "@/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useDocumentTitle } from "@uidotdev/usehooks";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useNavigate, useParams } from "react-router-dom";
import { CreatePost } from "../common/CreatePost";

export const UserProfile: React.FC<UserProfileProps> = () => {
  useDocumentTitle("Profile - UNIT");
  const { id } = useParams();
  const { ref, inView } = useInView();
  const [user, setUser] = useState<UserProfileProps>({
    id: 0,
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    avatar: "",
    createdAt: "",
  });
  const [isModalOpen, setModalOpen] = useState(false);
  const nav = useNavigate();

  const openModal = () => {
    setModalOpen(true);
  };
  const closeModal = () => setModalOpen(false);

  const decodedToken = jwtDecode<{ id: string }>(
    localStorage.getItem("accessToken")!
  );
  const currentUserId = decodedToken.id;

  const getUserProfileData = async () => {
    try {
      const response = await getOtherUserProfile(id!);
      setUser(response.data);
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
    }
  };

  const fetchPosts = async ({ pageParam }: { pageParam: number }) => {
    const res = await getPostByUserId(id!, pageParam);
    return res;
  };

  const { data, status, error, fetchNextPage, hasNextPage, refetch } =
    useInfiniteQuery({
      queryKey: ["post"],
      queryFn: fetchPosts,
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPage) => {
        const currentPage = lastPage.data?.page?.number;
        const totalPage = lastPage.data?.page?.totalPages;
        return currentPage < totalPage ? allPage.length + 1 : undefined;
      },
    });

  useEffect(() => {
    getUserProfileData();
  }, [id]);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage]);

  if (status === "pending") return <Loading />;
  if (status === "error")
    return (
      <div className="text-center text-red-500">
        {error instanceof Error ? error.message : "An error occurred"}
      </div>
    );

  const isMyProfile = parseInt(currentUserId) === parseInt(id!);

  const content = data.pages.map((page) => {
    if (page.data?.content.length === 0) {
      return (
        <div className="text-center text-gray-500 dark:text-white mt-4">
          No posts yet
        </div>
      );
    }
    return page.data?.content.map((post: PostProps) => {
      const currentPost = { ...post, profilePicture: user.avatar };
      return (
        <Post
          key={post.id}
          post={currentPost}
          innerRef={ref}
          onRefresh={refetch}
        />
      );
    });
  });

  const handleSendMessage = async () => {
    try {
      const response = await createChatIfNotExists(id!);
      if (response.status === 200) {
        nav(`/chat/c/d/${id}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-1 flex-col justify-center items-center px-6 py-12 lg:px-8 dark:bg-black bg-white h-screen overflow-y-scroll no-scrollbar">
      <div className="h-full w-4/5 lg:w-2/5">
        <div className="max-w-2xl mt-4">
          <div className="bg-white p-4 rounded-lg border dark:bg-zinc-800">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-black dark:text-white text-xl lg:text-2xl">
                  {user.firstName} {user.lastName}
                </div>
                <div className="text-black dark:text-white text-sm mt-2">
                  {user.username}
                </div>
              </div>
              <Avatar className="w-12 h-12 lg:w-24 lg:h-24">
                <AvatarImage
                  src={
                    user.avatar !== null
                      ? user.avatar
                      : "https://github.com/shadcn.png"
                  }
                  alt="@UserAvatar"
                />
                <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
            <div className="w-full mt-4">
              {isMyProfile ? (
                <Button onClick={openModal} className="w-full">
                  Edit Profile
                </Button>
              ) : (
                <Button className="w-full" onClick={handleSendMessage}>
                  Message
                </Button>
              )}
              {isModalOpen && (
                <EditProfile
                  isOpen={isModalOpen}
                  onClose={closeModal}
                  initialData={user}
                />
              )}
            </div>
          </div>
        </div>
        <div className="max-w-2xl">
          <div>
            {isMyProfile && (
              <CreatePost avatar={user.avatar} onRefresh={refetch} />
            )}
          </div>
          <div className="pb-20">{content}</div>
        </div>
      </div>
    </div>
  );
};
