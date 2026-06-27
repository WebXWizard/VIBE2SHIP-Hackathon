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
        bgImage="/images/rooms/deluxe-room/6R6A0308.webp" 
        heading="Deluxe Room" 
        subHeading="Check our Latest Seasional Promotions" 
        link="Check All Rooms"
    />
    <HomeForm />

    <section className="room-intro space">
        <div className="container">
            <h2>Your Home Away from Home in Deluxe Rooms Surrounded by Nature</h2>
            <p className="text-justify">
                The Deluxe Room at The MudFort Kuchesar offers the perfect balance of space, style, and heritage charm. Featuring elegant wooden furniture, high ceilings, and warm interiors, it reflects timeless rustic room design while ensuring modern convenience. With ample space for guests, these rooms combine history and comfort, making them one of the top-rated Deluxe Rooms near Delhi for travellers seeking relaxation in a royal fort.
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
                            "/images/rooms/deluxe-room/6R6A0258.webp",
                            "/images/rooms/deluxe-room/6R6A0268.webp",
                            "/images/rooms/deluxe-room/6R6A0276.webp",
                        ]}
                    />
                </div>
                <div className="col-lg-4">
                    <div className="content">
                        <h2>Rooms</h2>
                        <p className="text-justify">
                            Blending heritage character with modern amenities, the Deluxe Room is ideal for solo travellers, families and couples. With spacious interiors, traditional furniture, and cozy seating, it offers comfort for both short getaways and extended stays, making it a sought-after heritage room for family and couples just a short drive from Delhi.
                        </p>
                        {/* <p>
                            Guests share a spacious living room with a large sofa and a 65-inch TV, as well as a fully-equipped kitchenette, 
                            perfect for a relaxing and enjoyable stay in Delhi.
                        </p> */}
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
                        <h3>Deluxe Room</h3>
                        <h4><span>₹</span> 6,500 / Night</h4>

                    <p>
                    Offering a curious mixture of conventional and contemporary living style of 
                    the British era, these 10 rooms are the most favoured Deluxe Room around Delhi.
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
                <div className="col-lg-5"><img src="/images/rooms/deluxe-room/6R6A0276.webp" alt="" /></div>
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
                    <GalleryPage src="/images/rooms/deluxe-room-1/6R6A0317.webp" alt="room"/>
                    <GalleryPage src="/images/rooms/deluxe-room/6R6A0268.webp" alt="room"/>
                    <GalleryPage src="/images/rooms/deluxe-room/6R6A0276.webp" alt="room"/>
                    {/* <GalleryPage src="/images/rooms/deluxe-room/6R6A0308.webp" alt="room"/> */}
                    <GalleryPage src="/images/rooms/deluxe-room/6R6A0309.webp" alt="room"/>
                    <GalleryPage src="/images/rooms/deluxe-room/6R6A0312.webp" alt="room"/>
                    <GalleryPage src="/images/rooms/deluxe-room-1/6R6A0298.webp" alt="room"/>
                </PhotoProvider>
            </div>
        </div>
    </div>

    </>
  )
}

export default page