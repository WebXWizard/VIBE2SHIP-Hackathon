
'use client';
import GalleryPage from "@/components/GalleryPage"
import HomeHero from "@/components/HomeHero"
import Link from "next/link"
import { PhotoProvider } from 'react-photo-view';


const page = () => {
  return (
    <>
      <HomeHero 
              bgImage="/images/hero1.jpg" 
              heading={<>Suites & <br /> Apartments</>}  
              subHeading="Check our Latest Seasional Promotions" 
              link="Check All Rooms"
          />
      <div className="space">
        <div className="container">
        <div className="gallery_tabs">
          <Link href="#resort">Resort</Link>
          <Link href="#rooms">Rooms</Link>
          <Link href="#outdoor">Outdoor</Link>
          <Link href="#indoor">Indoor</Link>
          <Link href="#pool">Swimming Pool</Link>
        </div>
        <div className="title my-5" id="resort">
            <h2>The Resort</h2>
        </div>
        <div className="masonry">
           <PhotoProvider>
              <GalleryPage src="/images/gallery/2.jpg" alt="room"/>
              <GalleryPage src="/images/gallery/3.jpg" alt="room"/>
              <GalleryPage src="/images/gallery/5.jpg" alt="room"/>
              <GalleryPage src="/images/gallery/15.jpg" alt="room"/>
              <GalleryPage src="/images/gallery/20.jpg" alt="room"/>
              <GalleryPage src="/images/gallery/16.jpg" alt="room"/>
          </PhotoProvider>
        </div>
        <div className="title my-5" id="rooms">
            <h2>The Rooms</h2>
        </div>
        <div className="masonry">
          <PhotoProvider>
          <GalleryPage src="/images/rooms/heritage-room/DSC03351.webp" alt="room"/>
          <GalleryPage src="/images/rooms/deluxe-room-1/6R6A0298.webp" alt="room"/>
          {/* <GalleryPage src="/images/gallery/7.jpg" alt="room"/> */}
          <GalleryPage src="/images/rooms/super-deluxe-room/DSC03389.webp" alt="room"/>
          <GalleryPage src="/images/rooms/palace-room/6R6A1443.webp" alt="room"/>
          <GalleryPage src="/images/rooms/palace-room/6R6A1482.webp" alt="room"/>
          <GalleryPage src="/images/rooms/heritage-room/DSC03347.webp" alt="room"/>
          </PhotoProvider>
          
        </div>
        <div className="title my-5" id="outdoor">
            <h2>The Outdoor</h2>
        </div>
        <div className="masonry">
          <PhotoProvider>
          <GalleryPage src="/images/gallery/9.jpg" alt="room"/>
          <GalleryPage src="/images/day_picknic/5.jpg" alt="room"/>
          <GalleryPage src="/images/gallery/16.jpg" alt="room"/>
          <GalleryPage src="/images/gallery/17.jpg" alt="room"/>
          <GalleryPage src="/images/gallery/23.jpg" alt="room"/>
          <GalleryPage src="/images/gallery/29.jpg" alt="room"/>
          </PhotoProvider>
        </div>
        <div className="title my-5" id="indoor">
            <h2>The Indoor</h2>
        </div>
        <div className="masonry">
          <PhotoProvider>
          <GalleryPage src="/images/gallery/27.jpg" alt="room"/>
          <GalleryPage src="/images/gallery/22.jpg" alt="room"/>
          <GalleryPage src="/images/gallery/6R6A0664.webp" alt="room"/>
          <GalleryPage src="/images/gallery/19.jpg" alt="room"/>
          {/* <GalleryPage src="/images/gallery/15.jpg" alt="room"/> */}
          {/* <GalleryPage src="/images/swimming/6R6A4482.webp" alt="room"/> */}
          {/* <GalleryPage src="/images/gallery/5.jpg" alt="room"/> */}
          <GalleryPage src="/images/gallery/4.jpg" alt="room"/>
          <GalleryPage src="/images/gallery/6R6A0767.webp" alt="room"/>
          </PhotoProvider>
        </div>
        <div className="title my-5" id="pool">
            <h2>Swimming Pool</h2>
        </div>
        <div className="masonry">
          <PhotoProvider>
          <GalleryPage src="/images/swimming/6R6A4477.webp" alt="room"/>
          <GalleryPage src="/images/swimming/6R6A4488.webp" alt="room"/>
          <GalleryPage src="/images/swimming/6R6A4482.webp" alt="room"/>
          </PhotoProvider>
        </div>
      </div>
      </div>
    </>
  )
}

export default page