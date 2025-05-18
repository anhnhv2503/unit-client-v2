import { likeOrUnlikePost } from "@/services/postService";
import { MediaItem, PostProp } from "@/types";
import { playLikeSound } from "@/utils/audio";
import { calculateTime } from "@/utils/format";

import {
  BookmarkIcon,
  ChatBubbleOvalLeftIcon,
  HeartIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  HeartIcon as HeartIconSolid,
} from "@heroicons/react/24/solid";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { FC, MouseEvent, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const MediaGallery = ({
  mediaItems,
  onImageClick,
  isDragging,
}: {
  mediaItems: MediaItem[];
  onImageClick: (images: string[], index: number) => void;
  isDragging: boolean;
}) => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentImage, setCurrentImage] = useState<string>(mediaItems[0].url);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollPosition = container.scrollLeft;
      const containerWidth = container.offsetWidth;

      // Find which media item is most visible
      const mediaElements = Array.from(container.children) as HTMLElement[];
      let mostVisibleIndex = 0;
      let maxVisibleWidth = 0;

      mediaElements.forEach((item, index) => {
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
    setCurrentImage(mediaItems[nextIndex].url);
  };

  const handlePrevMedia = (e: MouseEvent) => {
    e.stopPropagation();
    const prevIndex = (activeIndex - 1 + mediaItems.length) % mediaItems.length;
    scrollToMedia(prevIndex);
    setCurrentImage(mediaItems[prevIndex].url);
  };

  // Mouse drag handling
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
    }
  };

  const handleMouseUpOrLeave = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.dataset.isDragging = "false";
    }
  };

  return (
    <div className="relative mt-3 mb-4 rounded-xl overflow-hidden group">
      {/* Media container with smooth scrolling */}
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
            className="flex-shrink-0 w-full h-96 snap-center overflow-hidden"
            style={{ scrollSnapAlign: "center" }}
          >
            {media.type === "image" ? (
              <img
                src={currentImage}
                alt={`Post media ${idx + 1}`}
                className="w-full h-full object-cover rounded-lg cursor-pointer transition-transform duration-300 hover:scale-105"
                onClick={() =>
                  !isDragging &&
                  onImageClick(
                    mediaItems.map((item) => item.url),
                    idx
                  )
                }
                loading="lazy"
              />
            ) : (
              <video
                src={media.url}
                className="w-full h-full object-cover rounded-lg"
                controls
                onClick={() =>
                  !isDragging &&
                  onImageClick(
                    mediaItems.map((item) => item.url),
                    idx
                  )
                }
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
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-40 hover:bg-opacity-60 text-white rounded-full p-2 no-nav z-10 transition-all opacity-0 group-hover:opacity-90 hover:scale-110"
            aria-label="Previous image"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <button
            onClick={handleNextMedia}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-40 hover:bg-opacity-60 text-white rounded-full p-2 no-nav z-10 transition-all opacity-0 group-hover:opacity-90 hover:scale-110"
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
                    : "w-2 bg-white bg-opacity-60 hover:bg-opacity-90"
                }`}
                aria-label={`Go to image ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const ImagePreview = ({
  handleOverlayClick,
  closeModal,
  selectedImage,
  initialIndex,
}: {
  handleOverlayClick: (e: MouseEvent<HTMLDivElement>) => void;
  closeModal: () => void;
  selectedImage: string[];
  initialIndex: number;
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % selectedImage.length);
  };

  const prevImage = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + selectedImage.length) % selectedImage.length
    );
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeModal]);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center"
      onClick={handleOverlayClick}
    >
      <div className="relative max-w-4xl w-full h-full flex items-center justify-center p-4">
        <button
          className="absolute top-4 right-4 text-white z-50 bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70"
          onClick={closeModal}
        >
          <X className="h-6 w-6" />
        </button>

        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={selectedImage[currentIndex]}
            alt="Enlarged preview"
            className="max-h-[85vh] max-w-full object-contain"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        </AnimatePresence>

        {selectedImage.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-3 hover:bg-opacity-70 transition-all"
            >
              <ArrowLeftIcon className="h-6 w-6" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-3 hover:bg-opacity-70 transition-all"
            >
              <ArrowRightIcon className="h-6 w-6" />
            </button>

            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
              {selectedImage.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(idx);
                  }}
                  className={`h-2.5 transition-all ${
                    currentIndex === idx
                      ? "w-8 bg-white"
                      : "w-2.5 bg-white bg-opacity-60"
                  } rounded-full`}
                  aria-label={`Go to image ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export const Post: FC<PostProp> = ({ post, innerRef, onRefresh, ...props }) => {
  const [likeCount, setLikeCount] = useState(post.likesCount);
  const [isLiked, setIsLiked] = useState(post.liked);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string[] | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [initialIndex, setInitialIndex] = useState(0);
  const [isScaling, setIsScaling] = useState(false);
  const navigate = useNavigate();
  const throttle = useRef(false);

  const processMedia = (media: string[]): MediaItem[] => {
    return media.map((url) => ({
      url,
      type: url.endsWith(".mp4") || url.endsWith(".mov") ? "video" : "image",
    }));
  };

  const mediaItems = processMedia(post.media);

  const handleImageClick = (images: string[], index: number) => {
    if (isDragging) return;
    setInitialIndex(index);
    setSelectedImage(images);
    setIsModalOpen(true);
  };

  const handleLike = async () => {
    if (throttle.current) return;

    throttle.current = true;
    setTimeout(() => {
      throttle.current = false;
    }, 700);

    setIsLiked((prev) => !prev);
    setIsScaling(true);

    try {
      await likeOrUnlikePost(post.id);
      setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));

      if (!isLiked) {
        playLikeSound();
      }

      setTimeout(() => setIsScaling(false), 300);
      onRefresh?.();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update like status.");
      setIsLiked((prev) => !prev); // Revert the state on error
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
      navigate(`/post?postId=${post.id}`);
    }
  };

  const navigateToProfile = (e: MouseEvent) => {
    e.stopPropagation();
    navigate(`/user-profile/${post.authorId}`);
  };

  const timeAgo = calculateTime(post.createdAt);

  return (
    <div className="mt-4 w-full" key={post.id} ref={innerRef} {...props}>
      <div
        className="bg-white dark:bg-zinc-800/90 p-5 shadow-sm border border-gray-100 dark:border-zinc-700 hover:shadow-md cursor-pointer rounded-2xl transition-all duration-300"
        onClick={handleMainClick}
      >
        {/* User info section with modern styling */}
        <div className="flex items-center mb-3">
          <div
            className="relative no-nav cursor-pointer"
            onClick={navigateToProfile}
          >
            <img
              src={post.avatar || "https://github.com/shadcn.png"}
              alt={`${post.author}'s profile picture`}
              className="w-11 h-11 rounded-full mr-3 ring-2 ring-offset-2 ring-violet-200 dark:ring-violet-500/30 dark:ring-offset-zinc-800 object-cover"
            />
            {/* Online status indicator could go here */}
          </div>

          <div
            className="no-nav cursor-pointer flex-grow"
            onClick={navigateToProfile}
          >
            <div className="flex items-center">
              <div className="font-semibold dark:text-white text-black text-base">
                {post.author || "UNIT User"}
              </div>
              <div className="text-gray-500 dark:text-gray-400 text-xs ml-2 flex items-center">
                <span className="inline-block w-1 h-1 rounded-full bg-gray-400 dark:bg-gray-500 mx-1"></span>
                {timeAgo}
              </div>
            </div>

            <div className="text-gray-500 dark:text-gray-300 text-sm">
              {post.authorId ? `@user${post.authorId}` : ""}
            </div>
          </div>
        </div>

        {/* Post content with improved spacing */}
        <div className="mb-3 dark:text-white text-black">
          <p className="text-base leading-relaxed">{post.content}</p>
        </div>

        {/* Media gallery component */}
        {post.media.length > 0 && (
          <MediaGallery
            mediaItems={mediaItems}
            onImageClick={handleImageClick}
            isDragging={isDragging}
          />
        )}

        {/* Interactive action buttons with hover effects */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-zinc-700">
          <div className="flex items-center space-x-2">
            {/* Like button with animation */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="flex items-center p-1.5 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-rose-50 dark:hover:bg-rose-900/20 group no-nav transition"
              onClick={(e) => {
                e.stopPropagation();
                handleLike();
              }}
            >
              <motion.div
                animate={{
                  scale: isScaling ? [1, 1.5, 1] : 1,
                  rotate: isScaling ? [0, 15, -15, 0] : 0,
                }}
                transition={{ duration: 0.3 }}
              >
                {isLiked ? (
                  <HeartIconSolid className="h-6 w-6 text-rose-500" />
                ) : (
                  <HeartIcon className="h-6 w-6 group-hover:text-rose-500 transition-colors" />
                )}
              </motion.div>
              <span
                className={`ml-1.5 font-medium ${
                  isLiked ? "text-rose-500" : ""
                } group-hover:text-rose-500 transition-colors`}
              >
                {likeCount > 0 ? likeCount : ""}
              </span>
            </motion.button>

            {/* Comment button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="flex items-center p-1.5 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 group no-nav transition"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/post?postId=${post.id}&userId=${post.authorId}`);
              }}
            >
              <ChatBubbleOvalLeftIcon className="h-6 w-6 group-hover:text-blue-500 transition-colors" />
              <span className="ml-1.5 font-medium group-hover:text-blue-500 transition-colors">
                {post.commentsCount > 0 ? post.commentsCount : ""}
              </span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Modal for fullscreen image preview */}
      {isModalOpen && selectedImage && (
        <ImagePreview
          handleOverlayClick={handleOverlayClick}
          closeModal={closeModal}
          selectedImage={selectedImage}
          initialIndex={initialIndex}
        />
      )}
    </div>
  );
};
