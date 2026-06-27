'use client';
import GalleryPage from "@/components/GalleryPage"
import HomeForm from "@/components/HomeForm"
import HomeHero from "@/components/HomeHero"
import Promotion from "@/components/Promotion";
import SingleSwiper from "@/components/SingleSwiper"
import { AlignHorizontalSpaceBetween, Bed, BedDouble, BriefcaseConveyorBelt, BrushCleaning, Coffee, Dog, Fan, Heater, Toilet, Wifi } from "lucide-react";
import { PhotoProvider } from "react-photo-view"
import Link from "next/link";

function page() {
  return (
    <>
    <HomeHero 
        bgImage="/images/rooms/super-deluxe-room/6R6A1441.webp" 
        heading="Super Deluxe Room" 
        subHeading="Check our Latest Seasional Promotions" 
        link="Check All Rooms"
    />
    <HomeForm />

    <section className="room-intro space">
        <div className="container">
            <h2>Your Home Away from Home in Super Deluxe Rooms Surrounded by Nature</h2>
            <p className="text-justify">
                The Super Deluxe Room at The MudFort Kuchesar is designed for comfort, space, and flexibility. Featuring elegant heritage-style furniture, a large king-sized bed, and an additional single bed, it is ideal for families or groups traveling together. With high ceilings, warm décor, and modern essentials, the Super Deluxe Room near Delhi combines heritage charm with convenience, ensuring a stay that feels indulgent yet practical for every guest.
            </p>
        </div>
    </section>    

    <div className="roomsSlider space_bottom">
        <div className="container">
            <div className="row g-0">
                <div className="col-lg-8">
                    <SingleSwiper
                        slidesPerView={1}
                        autoplayDelay={4000}
                        images={[
                            "/images/rooms/super-deluxe-room/6R6A1433.webp",
                            "/images/rooms/super-deluxe-room/6R6A1436.webp",
                            "/images/rooms/super-deluxe-room/6R6A1441.webp",
                            "/images/rooms/super-deluxe-room/6R6A1443.webp",
                            "/images/rooms/super-deluxe-room/6R6A1450.webp",
                        ]}
                    />
                </div>
                <div className="col-lg-4">
                    <div className="content">
                        <h2>Rooms</h2>
                        <p className="text-justify">
                            Spacious and versatile, the Super Deluxe Room offers both luxury and comfort. With a king-sized bed and an extra single bed, it’s perfect for families with children or small groups. Heritage furniture and modern amenities create a memorable stay near Delhi.
                        </p>
                         
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div className="space_bottom">
        <div className="container">
        <div className="room-card">
            <div className="row">
                <div className="col-lg-7">
                    <div className="copy">
                        <h3>Super Deluxe Room</h3>
                        <h4><span>₹</span> 7,500 / Night</h4>

                    <p>
                    Offering a curious mixture of conventional and contemporary living style of 
                    the British era, these 10 rooms are the most favoured Super Deluxe Room around Delhi.
                    </p>

                    <ul>
                        <li><Dog /> Pet Friendly</li>
                        <li><Coffee /> Tea/Coffee maker</li>
                        <li><Toilet />Toiletry Kits</li>
                        <li><BrushCleaning /> Daily Housekeeping</li>
                        <li><BriefcaseConveyorBelt /> Luggage Racks/Wardrobes</li>
                        <li><Heater /> Heating facilities in the room</li>
                        <li><Fan /> Individual Airconditioning units</li>
                        <li><Wifi /> Complimentary Wi-Fi during the stay</li>
                        <li><Bed /> Accommodation on Double/Triple Occupancy</li>
                        <li><BedDouble />Provision of Twin/Double bedded arrangement</li>
                        <li><AlignHorizontalSpaceBetween /> Minimum Living area of 400 Sq.Ft.</li>
                        
                    </ul>
                     <Link href="/" className="cta mt-4">Book Now</Link>
                    </div>
                </div>
                <div className="col-lg-5"><img src="/images/rooms/super-deluxe-room/6R6A1469.webp" alt="" /></div>
            </div>
        </div>
    </div>
    </div>


    <div className="container">
        <Promotion />
    </div>

    <div className="space">
        <div className="container">
            <div className="title text-center">
                <h2>Room Gallery</h2>
            </div>
            <div className="masonry">
                <PhotoProvider>
                    {/* <GalleryPage src="/images/rooms/super-deluxe-room/6R6A1436.webp" alt="room"/> */}
                    <GalleryPage src="/images/rooms/super-deluxe-room/6R6A1441.webp" alt="room"/>
                    <GalleryPage src="/images/rooms/super-deluxe-room/6R6A1443.webp" alt="room"/>
                    <GalleryPage src="/images/rooms/super-deluxe-room/6R6A1450.webp" alt="room"/>
                    <GalleryPage src="/images/rooms/super-deluxe-room/6R6A1469.webp" alt="room"/>
                    <GalleryPage src="/images/rooms/super-deluxe-room/6R6A1482.webp" alt="room"/>
                    <GalleryPage src="/images/rooms/super-deluxe-room/6R6A1492.webp" alt="room"/>
                    <GalleryPage src="/images/rooms/super-deluxe-room/6R6A1499.webp" alt="room"/>
                    {/* <GalleryPage src="/images/rooms/super-deluxe-room/6R6A1502.webp" alt="room"/> */}
                </PhotoProvider>
            </div>
        </div>
    </div>

    </>
  )
}

export default page