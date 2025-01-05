import SmallLoading from "@/components/common/loading/SmallLoading";
import { Post } from "@/components/common/Post";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getPostDetail } from "@/services/postService";
import { PostProps } from "@/types";
import { ArrowLeftIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export const PostDetail = () => {
  const nav = useNavigate();
  const [param] = useSearchParams();
  const postId = param.get("postId");

  const [post, setPost] = useState<PostProps>({
    id: 0,
    author: "",
    authorId: 0,
    avatar: "",
    content: "",
    media: [],
    likesCount: 0,
    commentsCount: 0,
    createdAt: "",
    liked: false,
  });
  const [content, setContent] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [postLoading, setPostLoading] = useState(false);

  const getPost = async () => {
    setPostLoading(true);
    try {
      const response = await getPostDetail(postId!);

      setPost(response.data);
      setPostLoading(false);
    } catch (error) {
      console.error("Error fetching post details:", error);
    }
  };

  // const getComments = async ({ pageParam }: { pageParam: number }) => {
  //   const response = await getCommentsByPostId(postId!, pageParam);
  //   return response.data;
  // };

  // const {
  //   data,
  //   error,
  //   fetchNextPage,
  //   hasNextPage,
  //   isFetchingNextPage,
  //   status,
  //   refetch,
  // } = useInfiniteQuery({
  //   queryKey: ["comments"],
  //   queryFn: getComments,
  //   initialPageParam: 0,
  //   getNextPageParam: (lastPage, pages) => {
  //     const nextPage = lastPage.length > 0 ? pages.length + 1 : undefined;
  //     return nextPage;
  //   },
  // });

  useEffect(() => {
    getPost();
  }, [postId]);

  // if (status === "pending") return <SmallLoading />;
  // if (status === "error") return <div>Error: {error.message}</div>;

  // const handleComment = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   try {
  //     setCommentLoading(true);
  //     const response = await createComment(postId!, {
  //       content,
  //       userId: userId!,
  //     });
  //     if (response.status === 200) {
  //       refetch();
  //       setContent("");
  //       toast.success("Comment Posted");
  //       setCommentLoading(false);
  //     }
  //   } catch (error) {
  //     setCommentLoading(true);
  //     console.error(error);
  //   }
  // };

  return (
    <div className="flex flex-1 flex-col justify-center items-center px-6 py-12 lg:px-8 dark:bg-black bg-white h-full overflow-y-scroll no-scrollbar">
      <div className="h-full w-4/5 lg:w-2/5">
        <div className="max-w-2xl mt-4">
          <div className="top-4 left-4">
            <Button
              onClick={() => nav(-1)}
              className="bg-white text-gray-700 p-2 rounded-full shadow-md hover:bg-gray-200 dark:bg-zinc-800 dark:text-gray-300"
            >
              <ArrowLeftIcon className="h-6 w-6" />
            </Button>
          </div>
        </div>
        {postLoading ? (
          <SmallLoading />
        ) : (
          <div className="">
            <Post post={post} />
            <div className="max-w-3xl mt-2 rounded-3xl w-full">
              <div className="bg-white dark:bg-black p-4 shadow rounded-3xl">
                <form
                  // onSubmit={handleComment}
                  className="flex flex-col gap-4"
                >
                  <Textarea
                    className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:text-gray-300"
                    rows={1}
                    placeholder="Write your comment here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                  />
                  <Button
                    type="submit"
                    className="self-end bg-black dark:bg-white text-white dark:text-black px-6 py-2 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!content.trim() || commentLoading}
                  >
                    <PaperAirplaneIcon
                      aria-hidden="true"
                      className="h-6 w-6 mr-1 cursor-pointer no-nav"
                    />
                  </Button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
