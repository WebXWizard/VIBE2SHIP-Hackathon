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
        bgImage="/images/rooms/heritage-room/DSC03333.webp" 
        heading="Heritage Room" 
        subHeading="Check our Latest Seasional Promotions" 
        link="Check All Rooms"
    />
    <HomeForm />

    <section className="room-intro space">
        <div className="container">
            <h2>Your Home Away from Home in Heritage Rooms Surrounded by Nature</h2>
            <p className="text-justify">
                Step into the charm of the Heritage Room at The MudFort Kuchesar, where history and comfort meet in perfect harmony. Designed to reflect classic heritage room design, each space combines rustic furniture, soft lighting, and vintage décor with modern amenities. Whether you’re seeking an escape into tradition or planning a family retreat, our top-rated Heritage Room near Delhi offers an atmosphere of timeless elegance and restful luxury.
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
                            "/images/rooms/heritage-room/DSC03326.webp",
                            "/images/rooms/heritage-room/DSC03333.webp",
                            "/images/rooms/heritage-room/DSC03335.webp",
                            "/images/rooms/heritage-room/DSC03341.webp",
                        ]}
                    />
                </div>
                <div className="col-lg-4">
                    <div className="content">
                        <h2>Rooms</h2>
                        <p className="text-justify">
                            The Heritage Room blends classic design with modern comforts, making it ideal for couples or small families. With warm interiors, comfortable bedding, and heritage-inspired décor, it offers a peaceful stay for those who want to experience an authentic heritage room near Delhi & Noida.
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
                        <h3>Heritage Room</h3>
                        <h4><span>₹</span> 6,000 / Night</h4>
                    <p>
                    Offering a curious mixture of conventional and contemporary living style of 
                    the British era, these 10 rooms are the most favoured Heritage Room around Delhi.
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
                <div className="col-lg-5"><img src="/images/rooms/heritage-room/DSC03351.webp" alt="" /></div>
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
                    {/* <GalleryPage src="/images/rooms/heritage-room/DSC03352.webp" alt="room"/> */}
                    <GalleryPage src="/images/rooms/heritage-room/DSC03351.webp" alt="room"/>
                    <GalleryPage src="/images/rooms/heritage-room/DSC03341.webp" alt="room"/>
                    <GalleryPage src="/images/rooms/heritage-room/DSC03335.webp" alt="room"/>
                    <GalleryPage src="/images/rooms/heritage-room/DSC03333.webp" alt="room"/>
                    <GalleryPage src="/images/rooms/heritage-room/DSC03326.webp" alt="room"/>
                    <GalleryPage src="/images/rooms/heritage-room/DSC03347.webp" alt="room"/>
                </PhotoProvider>
            </div>
        </div>
    </div>

    </>
  )
}

export default page