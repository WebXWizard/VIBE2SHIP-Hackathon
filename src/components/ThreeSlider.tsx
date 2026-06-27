"use client";

import { FC } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import Image from "next/image";
import "swiper/css";
import "swiper/css/navigation";

interface ThreeSliderProps {
  images: string[];
  title?: string;
}

const ThreeSlider: FC<ThreeSliderProps> = ({
  images,
  title = "Our Delicious Dishes",
}) => {
  return (
    <>
      {/* <h2 className="text-center mb-4">{title}</h2> */}

      <Swiper
        modules={[Navigation]}
        spaceBetween={5}
        navigation
        loop={true}
        breakpoints={{
          0: { slidesPerView: 1 },
          768: { slidesPerView: 1 },
          1024: { slidesPerView: 1 },
        }}
        className="food-slider singleSwiper"
      >
        {images.map((src, index) => (
          <SwiperSlide key={index}>
            <div className="overflow-hidden">
              <Image
                src={src}
                alt={`Food ${index + 1}`}
                width={600}
                height={500}
                className="object-cover w-full h-[400px] md:h-[500px] lg:h-[600px] transition-transform duration-300 ease-in-out hover:scale-105"
                priority
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

export default ThreeSlider;
