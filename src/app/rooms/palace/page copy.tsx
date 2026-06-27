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
        bgImage="/images/rooms/palace-room/6R6A1349.webp" 
        heading="Palace Room" 
        subHeading="Check our Latest Seasional Promotions" 
        link="Check All Rooms"
    />
    <HomeForm />

    <section className="room-intro space">
        <div className="container">
            <h2>Your Home Away from Home in Palace Rooms Surrounded by Nature</h2>
            <p className="text-justify">
               The Palace Room at The MudFort Kuchesar is designed for those who wish to experience regal living in its truest sense. Featuring intricately carved wooden furniture, high ceilings, and generous space, these rooms capture the elegance of an 18th-century heritage room design. Ideal for families or couples seeking luxury with history, the Palace Room near Noida blends royal charm with modern comfort, offering a stay that feels both indulgent and authentic.
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
                            "/images/rooms/palace-room/6R6A1348.webp",
                            "/images/rooms/palace-room/6R6A1349.webp",
                            "/images/rooms/palace-room/6R6A1350.webp",
                            "/images/rooms/palace-room/6R6A1351.webp",
                        ]}
                    />
                </div>
                <div className="col-lg-4">
                    <div className="content">
                        <h2>Rooms</h2>
                        <p className="text-justify">
                          The Palace Room offers a royal escape with its antique furniture, spacious interiors, and heritage-rich atmosphere. Perfect for couples or families, it combines palatial feels with comfort, making it one of the most sought-after heritage rooms for family getaways near Delhi.
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
                        <h3>Palace Room</h3>
                        <h4><span>₹</span> 7,000 / Night</h4>

                    <p>
                    Offering a curious mixture of conventional and contemporary living style of 
                    the British era, these 10 rooms are the most favoured Palace Room around Delhi.
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
                <div className="col-lg-5"><img src="/images/rooms/palace-room/6R6A1350.webp" alt="" /></div>
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
                    {/* <GalleryPage src="/images/rooms/palace-room/6R6A1372.webp" alt="room"/> */}
                    <GalleryPage src="/images/rooms/palace-room/6R6A1371.webp" alt="room"/>
                    <GalleryPage src="/images/rooms/palace-room/6R6A1367.webp" alt="room"/>
                    <GalleryPage src="/images/rooms/palace-room/6R6A1361.webp" alt="room"/>
                    <GalleryPage src="/images/rooms/palace-room/6R6A1359.webp" alt="room"/>
                    <GalleryPage src="/images/rooms/palace-room/6R6A1358.webp" alt="room"/>
                </PhotoProvider>
            </div>
        </div>
    </div>

    </>
  )
}

export default page