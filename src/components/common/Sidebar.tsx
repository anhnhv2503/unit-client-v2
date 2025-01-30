import ModePopover from "@/components/common/ModePopover";
import {
  BellIcon,
  ChatBubbleOvalLeftIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const nav = useNavigate();

  const decodedToken = jwtDecode<{ id: string }>(
    localStorage.getItem("accessToken")!
  );
  const currentUserId = decodedToken.id;

  return (
    <div className="dark:bg-neutral-950 bg-white dark:text-white text-black sm:w-16 w-full sm:h-screen h-16 fixed sm:left-0 bottom-0 flex sm:flex-col flex-row sm:justify-between items-center">
      <ul className="flex sm:flex-col flex-row sm:space-y-6 space-y-0 sm:space-x-0 space-x-6 sm:items-center items-center justify-center w-full sm:mt-auto sm:mb-auto">
        <li
          onClick={() => nav("/")}
          className="p-2 sm:p-4 hover:bg-gray-300 hover:text-zinc-800 rounded-lg transition hover:ease-out motion-reduce:transition-none motion-reduce:hover:transform-none"
        >
          <a className="flex items-center justify-center cursor-pointer">
            <HomeIcon className="w-7 h-7" />
          </a>
        </li>
        <li
          onClick={() => nav("/search")}
          className="p-2 sm:p-4 hover:bg-gray-300 hover:text-zinc-800 rounded-lg transition hover:ease-out motion-reduce:transition-none motion-reduce:hover:transform-none"
        >
          <a className="flex items-center justify-center cursor-pointer">
            <MagnifyingGlassIcon className="w-7 h-7" />
          </a>
        </li>
        <li
          // onClick={() => {
          //   nav("/notify"); // Navigate to the notifications page
          // }}
          className="p-2 sm:p-4 hover:bg-gray-300 hover:text-zinc-800 rounded-lg transition hover:ease-out motion-reduce:transition-none motion-reduce:hover:transform-none"
        >
          <a className="flex items-center justify-center cursor-pointer relative">
            <BellIcon className="w-7 h-7" />
            <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold rounded-full h-3 w-3 flex items-center justify-center transform translate-x-2 -translate-y-2"></span>
          </a>
        </li>
        <li
          onClick={() => {
            nav(`/user-profile/${currentUserId}`);
          }}
          className="p-2 sm:p-4 hover:bg-gray-300 hover:text-zinc-800 rounded-lg transition hover:ease-out motion-reduce:transition-none motion-reduce:hover:transform-none"
        >
          <a className="flex items-center justify-center cursor-pointer">
            <UserIcon className="w-7 h-7" />
          </a>
        </li>
        <li
          onClick={() => {
            nav(`/chat`);
          }}
          className="p-2 sm:p-4 hover:bg-gray-300 hover:text-zinc-800 rounded-lg transition hover:ease-out motion-reduce:transition-none motion-reduce:hover:transform-none"
        >
          <a className="flex items-center justify-center cursor-pointer">
            <ChatBubbleOvalLeftIcon className="w-7 h-7" />
          </a>
        </li>
      </ul>

      <ul className="hidden sm:flex sm:flex-col sm:space-y-4 sm:items-center sm:mb-4 ">
        <li className="p-2 sm:p-4 hover:bg-gray-300 hover:text-zinc-800 rounded-lg transition hover:ease-out motion-reduce:transition-none motion-reduce:hover:transform-none">
          <ModePopover />
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
