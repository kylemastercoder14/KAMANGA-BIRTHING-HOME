/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { FileNode } from "@prisma/client";

const GalleryDocumentation = ({ gallery }: { gallery: FileNode[] }) => {
  // 🖼️ Default base Unsplash images
  const baseImages = [
    "https://images.unsplash.com/photo-1528218635780-5952720c9729?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1176",
    "https://images.unsplash.com/photo-1493894473891-10fc1e5dbd22?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1169",
    "https://images.unsplash.com/photo-1532706302136-347336b002ec?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1171",
    "https://images.unsplash.com/photo-1634856435947-d790b5c3a8eb?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=687",
    "https://images.unsplash.com/photo-1588979355313-6711a095465f?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=672",
  ];

  // ✅ Compute final image list
  const images = useMemo(() => {
    if (gallery && gallery.length > 0) {
      return gallery
        .filter((file) => file.icon === "image")
        .map((file) => {
          // ✅ Encode file name to avoid issues with spaces or special chars
          const encodedName = encodeURIComponent(file.name);
          return `/file-manager/${encodedName}`;
        });
    }

    // Fallback: if gallery empty, use default Unsplash set
    return baseImages;
  }, [gallery]);

  // 🚫 Empty state check
  if (!images || images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground border rounded-xl">
        <p className="text-lg font-medium">No gallery images found</p>
        <p className="text-sm">Please upload some images to display here.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden">
      <Carousel
        opts={{ align: "center" }}
        className="w-full max-w-[99rem] mx-auto"
      >
        <CarouselContent>
          {images.map((img, index) => (
            <CarouselItem
              key={index}
              className="basis-1/1 md:basis-1/4 lg:basis-1/5"
            >
              <div className="relative w-full h-[300px]">
                <Image
                  src={img}
                  alt={`Gallery image ${index + 1}`}
                  fill
                  className="object-cover rounded-xl w-full h-full"
                  unoptimized
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* 🎯 Arrows inside gallery */}
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow p-2 rounded-full z-10" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow p-2 rounded-full z-10" />
      </Carousel>
    </div>
  );
};

export default GalleryDocumentation;
