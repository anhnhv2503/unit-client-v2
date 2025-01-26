import SmallLoading from "@/components/common/loading/SmallLoading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserProfileBody, UserProfileBodyType } from "@/schema/auth.schema";
import { updateProfile } from "@/services/authService";
import { UserProfileProps } from "@/types";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import { User2Icon } from "lucide-react";
import React, { Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  // onSave: (profileData: UserProfileProps) => void;
  initialData: UserProfileProps;
}

const EditProfile: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  // onSave,
  initialData,
}) => {
  const [profileData, setProfileData] = useState<UserProfileProps>(initialData);
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
        username: profileData.username,
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        email: profileData.email,
      },
    });

  async function onSubmit(values: UserProfileBodyType) {
    setLoading(true);
    try {
      const formdata = new FormData();
      formdata.append("username", values.username);
      formdata.append("email", values.email);
      formdata.append("firstName", values.firstName);
      formdata.append("lastName", values.lastName);
      formdata.append("imageFile", selectedImage!);

      const response = await updateProfile(formdata);
      if (response.status === 200) {
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
                  className="text-lg font-medium leading-6 text-gray-900 text-center"
                >
                  {profileData.firstName} {profileData.lastName}
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
                        className="block text-sm font-medium dark:text-black"
                      >
                        Username
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
                            <User2Icon className="h-6 w-6" />
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
                      className="block text-sm font-medium dark:text-black"
                    >
                      First Name
                    </Label>
                    <Input
                      {...userProfileData("firstName")}
                      id="bio"
                      type="text"
                      className="w-full mt-1 p-6 input border-none dark:text-black"
                      placeholder="Write bio"
                    />
                  </div>
                  <div className=" items-center">
                    <Label
                      htmlFor="bio"
                      className="block text-sm font-medium dark:text-black"
                    >
                      Last Name
                    </Label>
                    <Input
                      {...userProfileData("lastName")}
                      id="bio"
                      type="text"
                      className="w-full mt-1 p-6 input border-none dark:text-black"
                      placeholder="Write bio"
                    />
                  </div>
                  <div className=" items-center">
                    <Label
                      htmlFor="phone"
                      className="block text-sm font-medium dark:text-black"
                    >
                      Email
                    </Label>
                    <Input
                      {...userProfileData("email")}
                      id="phone"
                      type="email"
                      className="w-full mt-1 p-6 input border-none dark:text-black"
                      placeholder="Input Email"
                    />
                  </div>

                  <div className="flex justify-between items-center"></div>
                  <div className="w-full flex justify-center">
                    {loading ? (
                      <div className="flex justify-center my-10">
                        <SmallLoading />
                      </div>
                    ) : (
                      <>
                        <Button
                          type="submit"
                          className="w-full mt-7 dark:bg-black dark:text-white"
                        >
                          Save
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
