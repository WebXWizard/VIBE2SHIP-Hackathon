'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'

type SwiperProps = {
  images: string[]
  slidesPerView?: number
  autoplayDelay?: number
}

function CustomSwiper({ 
  images, 
  slidesPerView = 1, 
  autoplayDelay = 5000 
}: SwiperProps) {
  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      slidesPerView={slidesPerView}
      spaceBetween={10}
      autoplay={{ delay: autoplayDelay, disableOnInteraction: false }}
      navigation
      pagination={{ clickable: true }}
      className="singleSwiper"
    >
      {images.map((src, i) => (
        <SwiperSlide key={i}>
          <img src={src} alt={`slide-${i}`} />
        </SwiperSlide>
      ))}
    </Swiper>
  )
}

export default CustomSwiper
