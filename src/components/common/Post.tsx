import ImagePreview from "@/components/common/ImagePreview";
import { playLikeSound } from "@/utils/audio";
import { likeOrUnlikePost } from "@/services/postService";
import { MediaItem, PostProp } from "@/types";

import { ChatBubbleOvalLeftIcon, HeartIcon } from "@heroicons/react/24/outline";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/solid";
import { FC, MouseEvent, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { calculateTime } from "@/utils/format";

const fakeAvt = `https://github.com/shadcn.png`;

export const Post: FC<PostProp> = ({ post, innerRef, onRefresh, ...props }) => {
  const likeRef = useRef(post.likesCount);
  const [likeCount, setLikeCount] = useState(post.likesCount);
  const [isLiked, setIsLiked] = useState(post.liked);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string[] | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [index, setIndex] = useState(0);
  const nav = useNavigate();
  const [isScaling, setIsScaling] = useState(false);

  const processMedia = (media: string[]): MediaItem[] => {
    return media.map((url) => ({
      url,
      type: url.endsWith(".mp4") || url.endsWith(".mov") ? "video" : "image",
    }));
  };

  const mediaItems = processMedia(post.media);

  const scrollToMedia = (index: number) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const mediaItem = container.children[index] as HTMLElement;
      if (mediaItem) {
        container.scrollTo({
          left: mediaItem.offsetLeft - container.offsetLeft,
          behavior: "smooth",
        });
        setActiveIndex(index);
      }
    }
  };

  const handleNextMedia = (e: MouseEvent) => {
    e.stopPropagation();
    const nextIndex = (activeIndex + 1) % mediaItems.length;
    scrollToMedia(nextIndex);
  };

  const handlePrevMedia = (e: MouseEvent) => {
    e.stopPropagation();
    const prevIndex = (activeIndex - 1 + mediaItems.length) % mediaItems.length;
    scrollToMedia(prevIndex);
  };

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (scrollContainerRef.current) {
      scrollContainerRef.current.dataset.isDragging = "true";
      scrollContainerRef.current.dataset.startX = (
        e.pageX - scrollContainerRef.current.offsetLeft
      ).toString();
      scrollContainerRef.current.dataset.scrollLeft =
        scrollContainerRef.current.scrollLeft.toString();
    }
    setIsDragging(false);
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (scrollContainerRef.current?.dataset.isDragging !== "true") return;
    e.preventDefault();
    if (scrollContainerRef.current) {
      const startX = Number(scrollContainerRef.current.dataset.startX);
      const scrollLeft = Number(scrollContainerRef.current.dataset.scrollLeft);
      const x = e.pageX - scrollContainerRef.current.offsetLeft;
      const walk = x - startX;
      scrollContainerRef.current.scrollLeft = scrollLeft - walk;

      setIsDragging(true);
    }
  };

  const handleMouseUpOrLeave = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.dataset.isDragging = "false";
    }
    setTimeout(() => setIsDragging(false), 0);
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollPosition = container.scrollLeft;
      const containerWidth = container.offsetWidth;

      // Find which media item is most visible
      const mediaItems = Array.from(container.children) as HTMLElement[];
      let mostVisibleIndex = 0;
      let maxVisibleWidth = 0;

      mediaItems.forEach((item, index) => {
        const itemLeft = item.offsetLeft - container.offsetLeft;
        const itemRight = itemLeft + item.offsetWidth;
        const visibleLeft = Math.max(itemLeft, scrollPosition);
        const visibleRight = Math.min(
          itemRight,
          scrollPosition + containerWidth
        );
        const visibleWidth = Math.max(0, visibleRight - visibleLeft);

        if (visibleWidth > maxVisibleWidth) {
          maxVisibleWidth = visibleWidth;
          mostVisibleIndex = index;
        }
      });

      setActiveIndex(mostVisibleIndex);
    }
  };

  const handleImageClick = (images: string[], index: number) => {
    if (isDragging) return; // Prevent image click action if dragging occurred
    setIndex(index);
    setSelectedImage(images);
    setIsModalOpen(true);
  };

  const throttle = useRef(false);

  const handleLike = async () => {
    if (throttle.current) return;

    throttle.current = true;
    setTimeout(() => {
      throttle.current = false;
    }, 700);

    setIsLiked((prev) => !prev);

    try {
      setIsScaling(true);
      await likeOrUnlikePost(post.id);
      if (isLiked) {
        likeRef.current -= 1;
        setLikeCount(likeRef.current);
      } else {
        likeRef.current += 1;
        setLikeCount(likeRef.current);
        playLikeSound();
      }
      setTimeout(() => setIsScaling(false), 50);
      onRefresh?.();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update like status.");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const handleMainClick = (e: MouseEvent<HTMLDivElement>) => {
    if (!(e.target as HTMLElement).closest(".no-nav")) {
      nav(`/post?postId=${post.id}`);
    }
  };

  return (
    <div
      className="mt-3 rounded-3xl w-full"
      key={post.id}
      ref={innerRef}
      {...props}
    >
      <div
        className="bg-white dark:bg-zinc-800 p-4 shadow border cursor-pointer rounded-2xl transition-transform duration-300 ease-in-out"
        onClick={handleMainClick}
      >
        <div className="flex items-center mb-2">
          <img
            src={post.avatar || fakeAvt}
            alt="Profile picture of the second user"
            className="w-10 h-10 rounded-full mr-2 no-nav"
          />
          <div
            className="no-nav"
            onClick={() => {
              nav(`/user-profile/${post.authorId}`);
            }}
          >
            <div className="font-semibold dark:text-white text-black">
              {post.author || "UNIT User"}
            </div>
            <div className="text-gray-500 text-sm dark:text-white">
              {calculateTime(post.createdAt)}
            </div>
          </div>
        </div>

        <div className="mb-2 dark:text-white text-black">
          <p>{post.content}</p>
        </div>

        {/* Media area - modernized */}
        {post.media.length > 0 && (
          <div className="relative mt-3 mb-4 rounded-xl overflow-hidden">
            {/* Media container */}
            <div
              className="flex snap-x snap-mandatory no-nav relative"
              ref={scrollContainerRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUpOrLeave}
              onMouseLeave={handleMouseUpOrLeave}
              onScroll={handleScroll}
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                scrollSnapType: "x mandatory",
              }}
            >
              {mediaItems.map((media, idx) => (
                <div
                  key={idx}
                  className="flex-shrink-0 w-full h-80 md:h-96 snap-center"
                  style={{ scrollSnapAlign: "center" }}
                >
                  {media.type === "image" ? (
                    <img
                      src={media.url}
                      alt={`${post.author}'s post media`}
                      className="w-full h-full object-cover rounded-lg cursor-pointer"
                      onClick={() => handleImageClick(post.media, idx)}
                      loading="lazy"
                    />
                  ) : (
                    <video
                      src={media.url}
                      className="w-full h-full object-cover rounded-lg"
                      controls
                      onClick={() => handleImageClick(post.media, idx)}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Navigation arrows - only show if multiple media items */}
            {mediaItems.length > 1 && (
              <>
                <button
                  onClick={handlePrevMedia}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-2 no-nav z-10 transition-opacity opacity-60 hover:opacity-100"
                  aria-label="Previous image"
                >
                  <ArrowLeftIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={handleNextMedia}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-2 no-nav z-10 transition-opacity opacity-60 hover:opacity-100"
                  aria-label="Next image"
                >
                  <ArrowRightIcon className="h-5 w-5" />
                </button>

                {/* Pagination indicator */}
                <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1.5 z-10">
                  {mediaItems.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation();
                        scrollToMedia(idx);
                      }}
                      className={`h-2 rounded-full no-nav transition-all ${
                        activeIndex === idx
                          ? "w-6 bg-white"
                          : "w-2 bg-white bg-opacity-60"
                      }`}
                      aria-label={`Go to image ${idx + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        <div className="flex items-center mt-2 p-2 text-gray-500 dark:text-gray-200 text-sm">
          <div className="flex items-center p-1 mr-3 no-nav transition rounded-xl hover:ease-out motion-reduce:transition-none motion-reduce:hover:transform-none hover:bg-slate-100 hover:rounded-xl dark:hover:bg-zinc-700 dark:hover:text-white">
            <HeartIcon
              onClick={handleLike}
              aria-hidden="true"
              className={`h-8 w-8 mr-1 cursor-pointer no-nav transition-transform duration-200 ${
                isScaling ? "scale-125" : "scale-100"
              } ${
                isLiked ? "fill-rose-400 text-rose-400 bg-gradi" : "fill-none"
              }`}
              {...(isLiked ? { fill: "red", color: "red" } : { fill: "none" })}
            />
            {likeCount}
          </div>

          <div
            className="flex items-center p-1 mr-3 no-nav transition rounded-xl hover:ease-out motion-reduce:transition-none motion-reduce:hover:transform-none hover:bg-slate-100 hover:rounded-xl dark:hover:bg-zinc-700 dark:hover:text-white"
            onClick={(e) => {
              e.stopPropagation();
              nav(`/post?postId=${post.id}&userId=${post.authorId}`);
            }}
          >
            <div className="flex items-center">
              <ChatBubbleOvalLeftIcon className="h-8 w-8 mr-1 cursor-pointer" />
              {post.commentsCount}
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && selectedImage && (
        <ImagePreview
          handleOverlayClick={handleOverlayClick}
          closeModal={closeModal}
          selectedImage={selectedImage}
          initialIndex={index}
        />
      )}
    </div>
  );
};
