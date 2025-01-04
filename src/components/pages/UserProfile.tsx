import EditProfile from "@/components/common/EditProfile";
import Loading from "@/components/common/loading/Loading";
import { Post } from "@/components/common/Post";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { followUser, getUserProfile } from "@/services/authService";
import { getPostByUserId } from "@/services/postService";
import { PostProps } from "@/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useDocumentTitle } from "@uidotdev/usehooks";
import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useParams } from "react-router-dom";
import { CreatePost } from "../common/CreatePost";
import { ViewFollow } from "../common/ViewFollow";

type UserProfileProps = {
  UserId: string;
  UserName: string;
  Bio: string;
  PhoneNumber: string;
  DateOfBirth: string;
  Private: boolean;
  ProfilePicture: string;
  NumberOfFollwers: number;
  NumberOfFollowing: number;
  isFollowed: boolean;
  FollowRequests: { followerId: string }[];
};

export const UserProfile = () => {
  useDocumentTitle("Profile - UNIT");
  const { id } = useParams();
  const { ref, inView } = useInView();
  const [user, setUser] = useState<UserProfileProps>({
    UserId: "",
    UserName: "",
    Bio: "",
    PhoneNumber: "",
    DateOfBirth: "",
    Private: false,
    ProfilePicture: "",
    isFollowed: false,
    NumberOfFollwers: 0,
    FollowRequests: [],
    NumberOfFollowing: 0,
  });
  const [isFollow, setIsFollow] = useState(user.isFollowed);
  const isLogin = JSON.parse(localStorage.getItem("user_id")!) === id;
  const [isModalOpen, setModalOpen] = useState(false);
  const [isModalFollowOpen, setModalFollowOpen] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("user_id")!);
  const [selectedTab, setSelectedTab] = useState("");

  const openModal = () => {
    if (user.UserId) {
      setModalOpen(true);
    } else {
      console.log("User data is not yet loaded.");
    }
  };

  const closeModal = () => setModalOpen(false);

  const openModalFollow = () => setModalFollowOpen(true);

  const closeModalFollow = () => setModalFollowOpen(false);

  const getUserProfileData = async () => {
    try {
      const response = await getUserProfile(id!, isLogin);
      const profileData = response.data;
      if (!profileData.ProfilePicture) {
        setUser({
          ...profileData,
          ProfilePicture: "https://github.com/shadcn.png",
        });
      } else {
        setUser({
          ...profileData,
          ProfilePicture: `${
            profileData.ProfilePicture
          }?t=${new Date().getTime()}`, // Add timestamp
        });
      }
      setIsFollow(profileData.isFollowed);
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
        const nextPage =
          lastPage.data.length > 0 ? allPage.length + 1 : undefined;
        return nextPage;
      },
    });

  useEffect(() => {
    getUserProfileData();
  }, [isModalOpen, id]);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage]);

  const throttle = useRef(false);

  const handleFollowUser = async () => {
    if (throttle.current) return;

    throttle.current = true;
    setTimeout(() => {
      throttle.current = false;
    }, 700);

    // setIsFollow((prev) => !prev);

    try {
      const form = new FormData();
      form.append("follow", id!);
      const response = await followUser(form);
      getUserProfileData();
      console.log(response);
    } catch (err) {
      console.error("Failed to follow user:", err);
    }
  };

  const isRequested = () => {
    return (
      Array.isArray(user.FollowRequests) &&
      user.FollowRequests.some(
        (followrequest: { followerId: string }) =>
          followrequest.followerId === currentUser
      )
    );
  };

  // console.log(isRequested());

  if (user.Private && !isLogin && !isFollow)
    return (
      <div className="flex flex-1 flex-col justify-center items-center px-6 py-12 lg:px-8 dark:bg-black bg-white h-screen overflow-y-scroll no-scrollbar">
        <div className="h-full w-4/5 lg:w-2/5">
          <div className="max-w-2xl mt-4">
            <div className="bg-white p-4 rounded-lg border dark:bg-zinc-800">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-black dark:text-white text-xl lg:text-2xl">
                    {user.UserName}
                  </div>
                  <div className="text-black dark:text-white text-sm mt-2">
                    {user.Bio}
                  </div>
                </div>
                <Avatar className="w-12 h-12 lg:w-24 lg:h-24">
                  <AvatarImage
                    src={
                      user.ProfilePicture !== null
                        ? user.ProfilePicture
                        : "https://github.com/shadcn.png"
                    }
                    alt="@UserAvatar"
                  />
                  <AvatarFallback>{user.UserName.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>
              <div className="inline-block text-gray-300 text-sm mt-2 cursor-pointer border-b-2  hover:border-b-2 hover:border-gray-300">
                {user.NumberOfFollwers} Followers
              </div>
              {isLogin ? (
                <>
                  <div
                    onClick={openModal}
                    className="mt-20 p-2 font-semibold text-center rounded-lg border cursor-pointer bg-black text-white dark:text-black dark:bg-white"
                  >
                    Edit Profile
                  </div>
                  {isModalOpen && (
                    <EditProfile
                      isOpen={isModalOpen}
                      onClose={closeModal}
                      initialData={user}
                    />
                  )}
                </>
              ) : (
                <>
                  {!isFollow && isRequested() ? (
                    <>
                      {" "}
                      <div
                        className="mt-20 p-2 text-center rounded-lg border  cursor-pointer dark:text-white dark:border-white hover:bg-gray-50 hover:scale-105 transition transform duration-300 ease-in-out"
                        onClick={handleFollowUser}
                      >
                        Requested
                      </div>
                    </>
                  ) : (
                    <>
                      {" "}
                      <div
                        className="mt-20 p-2 text-center bg-black text-white rounded-lg cursor-pointer dark:bg-white dark:text-black hover:bg-gray-900 hover:scale-105 transition transform duration-300 ease-in-out"
                        onClick={handleFollowUser}
                      >
                        Follow
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="max-w-2xl text-center mt-3">
            This profile is private.
          </div>
        </div>
      </div>
    );

  if (status === "pending") return <Loading />;
  if (status === "error")
    return (
      <div className="text-center text-red-500">
        {user.Private ? "This profile is private." : `Error: ${error.message}`}
      </div>
    );

  const content = data.pages.map((page) => {
    return page.data.map((post: PostProps) => {
      const currentPost = { ...post, profilePicture: user.ProfilePicture };
      return (
        <Post
          key={post.postId}
          post={currentPost}
          innerRef={ref}
          onRefresh={refetch}
        />
      );
    });
  });

  return (
    <div className="flex flex-1 flex-col justify-center items-center px-6 py-12 lg:px-8 dark:bg-black bg-white h-screen overflow-y-scroll no-scrollbar">
      <div className="h-full w-4/5 lg:w-2/5">
        <div className="max-w-2xl mt-4">
          <div className="bg-white p-4 rounded-lg border dark:bg-zinc-800">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-black dark:text-white text-xl lg:text-2xl">
                  {user.UserName}
                </div>
                <div className="text-black dark:text-white text-sm mt-2">
                  {user.Bio}
                </div>
              </div>

              <Avatar className="w-12 h-12 lg:w-24 lg:h-24">
                <AvatarImage
                  src={
                    user.ProfilePicture !== null
                      ? user.ProfilePicture
                      : "https://github.com/shadcn.png"
                  }
                  alt="@UserAvatar"
                />
                <AvatarFallback>{user.UserName.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
            <div
              onClick={() => (openModalFollow(), setSelectedTab("followers"))}
              className="inline-block text-black dark:text-white text-sm mt-2 cursor-pointer border-b-2  hover:border-b-2 hover:border-gray-300"
            >
              Followers {user.NumberOfFollwers}
            </div>
            <div
              onClick={() => (openModalFollow(), setSelectedTab("following"))}
              className="inline-block text-black dark:text-white text-sm mt-2 cursor-pointer border-b-2  hover:border-b-2 hover:border-gray-300 ml-4"
            >
              Following {user.NumberOfFollowing}
            </div>
            {isModalFollowOpen && (
              <ViewFollow
                isOpen={isModalFollowOpen}
                onClose={closeModalFollow}
                userId={id}
                selectedTab={selectedTab}
              />
            )}
            {isLogin ? (
              <>
                <div
                  onClick={openModal}
                  className="mt-14 p-2 font-semibold text-center rounded-lg border cursor-pointer bg-black text-white dark:text-black dark:bg-white hover:bg-gray-900 hover:scale-105 transition transform duration-300 ease-in-out"
                >
                  Edit Profile
                </div>
                {isModalOpen && (
                  <EditProfile
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    initialData={user}
                  />
                )}
              </>
            ) : (
              <>
                {isFollow ? (
                  <>
                    {" "}
                    <div
                      className="mt-20 p-2 text-center rounded-lg border  cursor-pointer dark:text-white dark:border-white hover:bg-gray-50 hover:scale-105 transition transform duration-300 ease-in-out"
                      onClick={handleFollowUser}
                    >
                      Following
                    </div>
                  </>
                ) : (
                  <>
                    {" "}
                    <div
                      className="mt-20 p-2 text-center bg-black text-white rounded-lg cursor-pointer dark:bg-white dark:text-black"
                      onClick={handleFollowUser}
                    >
                      Follow
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
        <div className="max-w-2xl">
          <div>
            {currentUser === id && (
              <CreatePost avatar={user.ProfilePicture} onRefresh={refetch} />
            )}
          </div>
          {content}
        </div>
      </div>
    </div>
  );
};
