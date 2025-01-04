import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { UserProfileBody, UserProfileBodyType } from "@/schema/auth.schema";
import { updateProfile } from "@/services/authService";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  // onSave: (profileData: UserProfileProps) => void;
  initialData: UserProfileProps;
}

type UserProfileProps = {
  UserId: string;
  UserName: string;
  Bio: string;
  PhoneNumber: string;
  DateOfBirth: string;
  Private: boolean;
  ProfilePicture: string;
};

const EditProfile: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  // onSave,
  initialData,
}) => {
  const [profileData, setProfileData] = useState<UserProfileProps>(initialData);
  const handleToggle = (checked: boolean) => {
    setProfileData({ ...profileData, Private: checked });
  };
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [image, setImage] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      setSelectedImage(file);
      reader.onload = () => {
        setSelectedImage(file);
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const { register: userProfileData, handleSubmit } =
    useForm<UserProfileBodyType>({
      resolver: zodResolver(UserProfileBody),
      defaultValues: {
        username: profileData.UserName,
        bio: profileData.Bio,
        phonenumber: profileData.PhoneNumber,
        dateofbirth: profileData.DateOfBirth,
      },
    });

  async function onSubmit(values: UserProfileBodyType) {
    const date = new Date(values.dateofbirth).toISOString();
    setLoading(true);
    try {
      const formdata = new FormData();
      formdata.append("UserName", values.username);
      formdata.append("Bio", values.bio);
      formdata.append("PhoneNumber", values.phonenumber);
      formdata.append("DateOfBirth", date);
      formdata.append("Private", profileData.Private.toString());
      formdata.append("imageFile", selectedImage!);

      const response = await updateProfile(formdata);
      if (response.status === 200) {
        localStorage.setItem("isPrivate", JSON.stringify(profileData.Private));
        setLoading(false);
        toast.success("Profile Updated");
        onClose();
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Edit Profile
                </Dialog.Title>
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>

                <form className="space-y-2" onSubmit={handleSubmit(onSubmit)}>
                  <div className="flex justify-between items-center">
                    <div>
                      <Label
                        htmlFor="name"
                        className="block text-lg font-medium dark:text-black"
                      >
                        Name
                      </Label>
                      <Input
                        {...userProfileData("username")}
                        id="name"
                        type="text"
                        className="w-full mt-1 p-6 input border-none dark:text-black"
                        placeholder="Your name"
                      />
                    </div>
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 relative overflow-hidden">
                      {selectedImage ? (
                        <img
                          src={image!}
                          alt="Uploaded"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <label className="flex flex-col items-center justify-center cursor-pointer">
                          <div className="bg-gray-200 p-4 rounded-full">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="size-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
                              />
                            </svg>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  </div>
                  <div className=" items-center">
                    <Label
                      htmlFor="bio"
                      className="block text-lg font-medium dark:text-black"
                    >
                      Bio
                    </Label>
                    <Input
                      {...userProfileData("bio")}
                      id="bio"
                      type="text"
                      className="w-full mt-1 p-6 input border-none dark:text-black"
                      placeholder="Write bio"
                    />
                  </div>
                  <div className=" items-center">
                    <Label
                      htmlFor="phone"
                      className="block text-lg font-medium dark:text-black"
                    >
                      PhoneNumber
                    </Label>
                    <Input
                      {...userProfileData("phonenumber")}
                      id="phone"
                      type="text"
                      className="w-full mt-1 p-6 input border-none dark:text-black"
                      placeholder="Input phone"
                    />
                  </div>
                  <div className=" items-center">
                    <Label
                      htmlFor="dob"
                      className="block text-lg font-medium dark:text-black"
                    >
                      DateOfBirth
                    </Label>
                    <Input
                      {...userProfileData("dateofbirth")}
                      id="dob"
                      type="Date"
                      className="w-full mt-1 p-6 input border-none dark:text-black"
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <Label
                      htmlFor="bio"
                      className="block text-lg font-medium dark:text-black"
                    >
                      Private Profile
                    </Label>
                    <Switch
                      checked={profileData.Private}
                      onCheckedChange={handleToggle}
                      className="data-[state=checked]:bg-gray-300 data-[state=unchecked]:bg-zinc-800 dark:data-[state=checked]:bg-gray-300 dark:data-[state=unchecked]:bg-zinc-500"
                    />
                  </div>
                  <div className="w-full flex justify-center">
                    {loading ? (
                      <>
                        <div className="flex justify-center my-10">
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-black"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                        </div>
                      </>
                    ) : (
                      <>
                        <Button className="w-full mt-7 dark:bg-black dark:text-white">
                          Done
                        </Button>
                      </>
                    )}
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default EditProfile;
