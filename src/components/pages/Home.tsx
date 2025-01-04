import Loading from "@/components/common/loading/Loading";
import { Post } from "@/components/common/Post";
import { getUserAvatar } from "@/services/authService";
import { getPosts } from "@/services/postService";
import { PostProps } from "@/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useDocumentTitle } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { CreatePost } from "../common/CreatePost";

const Home = () => {
  useDocumentTitle("Home - UNIT");
  const { ref, inView } = useInView();
  const [userAvatar, setUserAvatar] = useState<string>("");

  const fetchPosts = async ({ pageParam }: { pageParam: number }) => {
    const res = await getPosts(pageParam);
    return res;
  };

  const getAvatar = async () => {
    const response = await getUserAvatar();
    setUserAvatar(response.data.avatar);
  };

  const { data, status, error, fetchNextPage, hasNextPage, refetch } =
    useInfiniteQuery({
      queryKey: ["posts"],
      queryFn: fetchPosts,
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPage) => {
        const currentPage = lastPage.data?.page?.number;
        const totalPage = lastPage.data?.page?.totalPages;
        return currentPage < totalPage ? allPage.length + 1 : undefined;
      },
    });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  useEffect(() => {
    getAvatar();
  }, []);

  if (status === "pending") return <Loading />;
  if (status === "error") return <div>Error: {error.message}</div>;

  const content = data.pages.map((page) => {
    return page.data?.content.map((post: PostProps) => {
      return (
        <Post key={post.id} post={post} innerRef={ref} onRefresh={refetch} />
      );
    });
  });

  return (
    <div className="flex flex-1 flex-col justify-center items-center px-6 py-12 lg:px-8 dark:bg-black bg-white h-full overflow-y-scroll no-scrollbar">
      <div className="h-full w-4/5 lg:w-1/2">
        <CreatePost avatar={userAvatar} onRefresh={refetch} />
        {content}
      </div>
    </div>
  );
};

export default Home;
