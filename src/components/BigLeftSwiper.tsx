"use client";

import { useState, useEffect } from "react";

type BigLeftSliderProps = {
  images: string[];
};

function BigLeftSlider({ images }: BigLeftSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000); // Slides every 3 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [images.length]);

  return (
    <div className="big-left-slider relative w-full max-w-4xl mx-auto">
      <div className="slider-content flex items-center justify-center space-x-4">
        <div className="small-image flex-shrink-0">
          <img
            src={images[(currentIndex - 1 + images.length) % images.length]}
            alt="Previous"
            className="w-full h-40 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          />
        </div>
        <div className="main-image flex-grow">
          <img
            src={images[currentIndex]}
            alt="Main"
            className="w-full h-64 object-cover rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
          />
        </div>
        <div className="small-image flex-shrink-0">
          <img
            src={images[(currentIndex + 1) % images.length]}
            alt="Next"
            className="w-full h-40 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          />
        </div>
      </div>
    </div>
  );
}

export default BigLeftSlider;