import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import React, { useEffect, useState } from "react";

type ImagePreviewProps = {
  selectedImage: string[] | undefined;
  closeModal: () => void;
  handleOverlayClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  initialIndex?: number; // Optional prop to set the initial index
};

const ImagePreview: React.FC<ImagePreviewProps> = ({
  handleOverlayClick,
  selectedImage,
  initialIndex = 0, // Default to 0 if no index is provided
}) => {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  console.log(initialIndex);

  useEffect(() => {
    setActiveIndex(initialIndex);
  }, [initialIndex]); // Update the index when the initialIndex prop changes

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 "
      onClick={handleOverlayClick}
    >
      <div className="relative w-full max-w-screen-md md:max-w-lg lg:max-w-xl">
        <Carousel
          className="w-full"
          opts={{
            align: "start",
            loop: true,
            // initialIndex: activeIndex, // Set the initial index to activeIndex
            // onChange: handleSlideChange, // Handle slide changes
            startIndex: activeIndex, // Set the start index to activeIndex
          }}
        >
          <CarouselContent>
            {selectedImage?.map((img, index) => (
              <CarouselItem key={index}>
                <Card className=" relative ">
                  <div
                    className="absolute inset-0 bg-cover bg-center blur-lg opacity-100 "
                    style={{ backgroundImage: `url(${img})` }}
                  />
                  <CardContent className="flex items-center justify-center p-0 relative z-10">
                    {img.endsWith(".mp4") || img.endsWith(".mov") ? (
                      <video
                        src={img}
                        controls
                        className="w-auto max-h-[75vh] md:max-h-[85vh] object-contain rounded-lg shadow-lg"
                      />
                    ) : (
                      <img
                        src={img || ""}
                        alt="Image"
                        className="w-auto max-h-[75vh] md:max-h-[85vh] object-contain rounded-lg shadow-lg"
                      />
                    )}
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
};

export default ImagePreview;
