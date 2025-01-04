import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { searchUser } from "@/services/authService";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useDocumentTitle } from "@uidotdev/usehooks";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const defaultProfilePicture =
  "https://images.pexels.com/photos/19640832/pexels-photo-19640832/free-photo-of-untitled.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load";

type SearchProps = {
  UserName: string;
  Bio: string;
  ProfilePicture: string;
  UserId: string;
};

const Search = () => {
  useDocumentTitle("Search - UNIT");
  const nav = useNavigate();
  const [data, setData] = useState<SearchProps[]>([]);
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const res = await searchUser(e.target.value);
    setData(res.data);
  };

  return (
    <div className="flex flex-col items-center px-6 py-12 lg:px-8 min-h-screen dark:bg-black bg-white overflow-y-scroll no-scrollbar">
      <div className="w-full flex justify-center mt-10">
        <div className="flex max-w-lg w-full items-center space-x-2">
          <Input
            type="text"
            placeholder="Search"
            className="w-full dark:bg-neutral-800"
            onChange={handleChange}
          />
          <Button type="submit">
            <MagnifyingGlassIcon className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* This wrapper div will give equal width to both sections */}
      <div className="w-full max-w-lg">
        <div className="p-4">
          {data.map((member, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow p-4 mb-4 flex items-center text-black cursor-pointer"
              onClick={() => nav(`/user-profile/${member.UserId}`)}
            >
              <img
                className="w-12 h-12 rounded-full mr-4"
                src={
                  member.ProfilePicture
                    ? member.ProfilePicture
                    : defaultProfilePicture
                }
                alt={member.ProfilePicture}
              />
              <div>
                <div className="text-lg font-semibold">{member.UserName}</div>
                <div className="text-gray-500">{member.Bio}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Search;
