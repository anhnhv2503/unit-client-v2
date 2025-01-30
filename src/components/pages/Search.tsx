import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { searchUser } from "@/services/authService";
import { SearchProps } from "@/types";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useDebounce, useDocumentTitle } from "@uidotdev/usehooks";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const defaultProfilePicture =
  "https://images.pexels.com/photos/19640832/pexels-photo-19640832/free-photo-of-untitled.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load";

const Search = () => {
  useDocumentTitle("Search - UNIT");
  const nav = useNavigate();
  const [data, setData] = useState<SearchProps[]>([]);
  const [inputSearch, setInputSearch] = useState("");
  const inputSearchDebounced = useDebounce(inputSearch, 300);

  const fetchSearchUsers = useCallback(async (query = "") => {
    try {
      if (query === "") {
        setData([]);
        return;
      }
      const response = await searchUser(query);
      setData(response.data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchSearchUsers(inputSearchDebounced);
  }, [inputSearchDebounced, fetchSearchUsers]);

  return (
    <div className="flex flex-col items-center px-6 py-12 lg:px-8 min-h-screen dark:bg-neutral-950 bg-white overflow-y-scroll no-scrollbar">
      <div className="w-full flex justify-center mt-10">
        <div className="flex max-w-lg w-full items-center space-x-2">
          <Input
            type="text"
            placeholder="Search"
            className="w-full dark:bg-neutral-800"
            onChange={(e) => setInputSearch(e.target.value)}
          />
          <Button type="submit">
            <MagnifyingGlassIcon className="h-6 w-6" />
          </Button>
        </div>
      </div>
      <div className="w-full max-w-lg">
        <div className="p-4">
          {data.map((member, index) => (
            <div
              key={index}
              className="bg-white dark:bg-zinc-800 rounded-lg shadow p-4 mb-4 flex items-center text-black cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-transform duration-300 ease-in-out"
              onClick={() => nav(`/user-profile/${member.id}`)}
            >
              <img
                className="w-12 h-12 rounded-full mr-4"
                src={member.avatar ? member.avatar : defaultProfilePicture}
                alt={member.avatar}
              />
              <div>
                <div className="text-lg font-semibold dark:text-white text-black">
                  {member.firstName} {member.lastName}
                </div>
                <div className="text-gray-500">{member.email}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Search;
