import React, { useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ImageUploadProps {
  setUserAvatar: (value: string | null) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ setUserAvatar }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log(file);
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
        setUserAvatar(selectedImage);
      };
      reader.readAsDataURL(file);
    }
  };
  console.log(selectedImage);

  return (
    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 relative overflow-hidden">
      {selectedImage ? (
        <img
          src={selectedImage}
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
  );
};

export default ImageUpload;
