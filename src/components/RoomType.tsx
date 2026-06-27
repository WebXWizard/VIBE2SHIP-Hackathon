'use client'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import Link from "next/link"
import { CookingPot, BedDouble, Wifi, Bath, LandPlot } from 'lucide-react';

// import required modules
import { Pagination, Autoplay } from 'swiper/modules';
import Image from 'next/image';


const rooms = [
  {
    id: 1,
    title: "Heritage Room",
    desc: "Step into the warmth of history with our Heritage Rooms, designed with rustic charm and modern comfort. Perfect for couples or small families seeking an authentic heritage resort experience near Delhi NCR.",
    img: "/images/rooms/heritage-room/DSC03351.webp",
    features: [
      { icon: <LandPlot />, text: "350 Square Feet" },
      { icon: <Bath />, text: "Premium Bath Amenities" },
      { icon: <Wifi />, text: "Wifi Connectivity" },
      { icon: <BedDouble />, text: "King Size Bed" },
      { icon: <CookingPot />, text: "Breakfast" },
    ],
  },
  {
    id: 2,
    title: "Deluxe Room",
    desc: "With spacious layouts and heritage-inspired décor, Deluxe Rooms are ideal for families. Comfort meets tradition with modern amenities, making them a favourite for longer stays.",
    img: "/images/rooms/deluxe-room/6R6A0309.webp",
    features: [
      { icon: <LandPlot />, text: "500 Square Feet" },
      { icon: <Bath />, text: "Luxury Bath Amenities" },
      { icon: <Wifi />, text: "High-Speed Wifi" },
      { icon: <BedDouble />, text: "Queen Size Bed" },
      { icon: <CookingPot />, text: "Complimentary Breakfast" },
    ],
  },
  {
    id: 3,
    title: "Super Deluxe Room",
    desc: "Our finest offering, the Super Deluxe Room, provides unmatched space and regal style. With premium comfort and serene views, it’s the ultimate choice for indulgent stays.",
    img: "/images/rooms/super-deluxe-room/DSC03389.webp",
    features: [
      { icon: <LandPlot />, text: "500 Square Feet" },
      { icon: <Bath />, text: "Luxury Bath Amenities" },
      { icon: <Wifi />, text: "High-Speed Wifi" },
      { icon: <BedDouble />, text: "Queen Size Bed" },
      { icon: <CookingPot />, text: "Complimentary Breakfast" },
    ],
  },
  {
    id: 4,
    title: "Palace Room",
    desc: "The Palace Room combines 18th-century grandeur with contemporary elegance. Antique furnishings, poster beds and vintage charm - create a luxurious heritage experience.",
    img: "/images/rooms/palace-room/6R6A1443.webp",
    features: [
      { icon: <LandPlot />, text: "500 Square Feet" },
      { icon: <Bath />, text: "Luxury Bath Amenities" },
      { icon: <Wifi />, text: "High-Speed Wifi" },
      { icon: <BedDouble />, text: "Queen Size Bed" },
      { icon: <CookingPot />, text: "Complimentary Breakfast" },
    ],
  },
]

export default function RoomType() {
  return (
    <>
    <div className="room_type space">
            <div className="container">
                <div className="title">
                    <h2>All Room Type</h2>
                </div>
                <Swiper modules={[Pagination, Autoplay]} autoplay={{delay: 5000, disableOnInteraction: false }} slidesPerView={1}
                        spaceBetween={10}
                        pagination={{
                        clickable: true,
                        }} className="mySwiper">

                    {rooms.map((room) => (
                        <SwiperSlide key={room.id}>
                        <div className="each_room">
                            <div className="row g-5 align-items-center">
                            <div className="col-lg-6">
                                <Image width={1200} height={450} src={room.img} alt={room.title} />
                            </div>
                            <div className="col-lg-6">
                                <h2>{room.title}</h2>
                                <p>{room.desc}</p>
                                <ul>
                                {room.features.map((f, idx) => (
                                    <li key={idx}>{f.icon} {f.text}</li>
                                ))}
                                </ul>
                                <Link href="/" className="cta">Book Now</Link>
                            </div>
                            </div>
                        </div>
                        </SwiperSlide>
                    ))}

                    
                </Swiper>
            </div>
        </div>
      
    </>
  );
}
