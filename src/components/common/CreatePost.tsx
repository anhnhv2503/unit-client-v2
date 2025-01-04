import CreatePostModal from "@/components/common/CreatePostModal";

const fakeAvt = "https://github.com/shadcn.png";

interface CreatePostProps {
  avatar?: string;
  onRefresh: () => Promise<any>;
}

export const CreatePost = ({ avatar, onRefresh }: CreatePostProps) => {
  return (
    <div className="bg-white dark:bg-zinc-800 p-4 shadow border rounded-2xl mt-4">
      <div className="flex justify-between items-top mb-2">
        <div className="flex-none w-10 h-10 mr-4">
          <img
            src={avatar ? avatar : fakeAvt}
            alt="Profile picture of the second user"
            className="w-10 h-10 rounded-full mr-4"
          />
        </div>
        <div className="flex justify-center items-center">
          <CreatePostModal
            avatar={avatar}
            title="What's New?"
            isPrimary={false}
            onRefresh={onRefresh}
          />
        </div>
        <div className="mt-2">
          <CreatePostModal
            avatar={avatar}
            title="Post"
            isPrimary={true}
            onRefresh={onRefresh}
          />
        </div>
      </div>
    </div>
  );
};
