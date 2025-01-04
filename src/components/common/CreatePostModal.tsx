import SmallLoading from "@/components/common/loading/SmallLoading";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { createPost } from "@/services/postService";
import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { ChangeEvent, MouseEvent, useRef, useState } from "react";
import { toast } from "sonner";

const fakeAvt = `https://github.com/shadcn.png`;

const CreatePostModal = ({
  title,
  isPrimary,
  onRefresh,
  avatar,
}: {
  title?: string | JSX.Element;
  isPrimary?: boolean;
  onRefresh: () => Promise<any>;
  avatar?: string | null;
}) => {
  const [previewMedia, setPreviewMedia] = useState<
    { url: string; type: string }[]
  >([]);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [content, setContent] = useState<string>("");
  const [images, setImages] = useState<File[]>([]);
  const [isUpload, setIsUpLoad] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);

  const MAX_MEDIA_COUNT = 4;

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

  const handleMediaChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setImages((prev) => [...prev, ...files]);
    if (previewMedia.length > MAX_MEDIA_COUNT) {
      toast.info(`You can only upload ${MAX_MEDIA_COUNT} files at a time.`);
      return;
    }
    const mediaData = files.map((file) => ({
      url: URL.createObjectURL(file),
      type: file.type,
    }));

    setPreviewMedia((prev) => [...prev, ...mediaData]);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) {
          const imageUrl = {
            url: URL.createObjectURL(file),
            type: file.type,
          };
          setPreviewMedia((prev) => [...prev, imageUrl]);
        }
      }
    }
  };

  const removeMedia = (index: number) => {
    setPreviewMedia((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreatePost = async () => {
    setIsUpLoad(true);
    const formData = new FormData();
    formData.append("content", content);
    images.forEach((image) => {
      formData.append("media", image);
    });

    try {
      const res = await createPost(formData);
      if (res) {
        setIsUpLoad(false);
        toast.success("Posted");
        setContent("");
        setImages([]);
        setPreviewMedia([]);
        setIsOpen(false);
        setTimeout(() => {
          onRefresh();
        }, 500);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          {...(isPrimary
            ? { className: `dark:bg-white dark:hover:bg-neutral-300` }
            : {
                className:
                  "bg-white shadow-none border-none hover:bg-white text-gray-500 dark:bg-zinc-800 dark:text-white",
              })}
        >
          {title}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px] dark:bg-zinc-900 bg-white">
        <DialogHeader>
          <DialogTitle className="text-center dark:text-white text-black">
            New Post
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="">
          <div className="flex items-center mb-2 ">
            <Avatar className="w-10 h-10 rounded-full mr-2 no-nav">
              <AvatarImage src={avatar || fakeAvt} alt="@UserAvatar" />
              <AvatarFallback></AvatarFallback>
            </Avatar>
          </div>
          <div className=" items-center">
            <Textarea
              placeholder="How are you feeling today?"
              className="w-full border border-none outline outline-none"
              onPaste={handlePaste}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <div className="flex mt-3">
            <label
              htmlFor="images"
              className="cursor-pointer dark:text-white text-black"
            >
              <PhotoIcon
                aria-hidden="true"
                className="h-9 w-9 mr-1 cursor-pointer no-nav hover:bg-gray-100 dark:hover:bg-gray-500 p-1 rounded-md"
              />
            </label>
            <input
              id="images"
              name="images"
              type="file"
              className="hidden"
              onChange={handleMediaChange}
              multiple
              accept="*"
            />
            <div
              className="mt-4 flex space-x-4 overflow-x-auto p-2 no-scrollbar cursor-grab no-nav"
              ref={scrollContainerRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUpOrLeave}
              onMouseLeave={handleMouseUpOrLeave}
            >
              {previewMedia?.map((media, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 relative h-40 sm:h-48 md:h-56"
                >
                  <div
                    className="absolute top-2 right-2 text-white text-2xl h-5 w-5 font-bold rounded-full bg-black bg-opacity-50 cursor-pointer z-50"
                    onClick={() => removeMedia(index)}
                  >
                    <XMarkIcon />
                  </div>
                  <div className="w-full h-full rounded-lg overflow-hidden bg-gray-100 border border-gray-300 shadow-sm hover:shadow-md transition-shadow duration-200 ease-in-out">
                    {media.type.startsWith("video") ? (
                      <video
                        src={media.url}
                        controls
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={media.url}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          {isUpload ? (
            <SmallLoading />
          ) : (
            <Button
              type="submit"
              onClick={handleCreatePost}
              disabled={!content}
            >
              Post
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostModal;
