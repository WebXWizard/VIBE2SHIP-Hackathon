import Activities from "@/components/Activities";
import BestResort from "@/components/BestResort";
import BlogHome from "@/components/BlogHome";
import Highlights from "@/components/Highlights";
import Gallery from "@/components/Gallery";
import HomeForm from "@/components/HomeForm";
import HomeHero from "@/components/HomeHero";
import Prices from "@/components/Prices";
import RoomType from "@/components/RoomType";
import Testimonial from "@/components/Testimonial";
import Facilities from "@/components/Facilities";
import LightboxGallery from "@/components/Serial";
import { Clock, SquareCheckBig } from "lucide-react";
import Link from "next/link";


export default async function Home() {
  return (
    <>
      <HomeHero 
          bgImage="/images/hero1.jpg" 
          heading={<>Suites & <br /> Apartments</>}  
          subHeading="Check our Latest Seasional Promotions" 
          link="Check All Rooms"
      />
      <HomeForm />
      <BestResort />
      <Highlights />
      <Prices />
      <Facilities />
      {/* <Rooms /> */}
      <RoomType />

      <div className="package space">
        <div className="container">
          <div className="row align-items-center justify-content-center">
            <div className="col-lg-5">
              <div className="title">
                <h2>Day Package</h2>
              </div>
              <div className="rate">₹ 1750 <small className="text-muted">per person + 5% tax</small></div>
              <Link href="#" className="cta">Book Now</Link>
            </div>
            <div className="col-lg-4">
              <ul>
              <li><SquareCheckBig /> Welcome drink</li>
              <li><SquareCheckBig /> Use of facilities and fort premises</li>
              <li><SquareCheckBig /> Mentioned amenities</li>
              <li><SquareCheckBig /> Hot buffet lunch</li>
              <li><SquareCheckBig /> Evening tea with snack</li>
            </ul>
        
              <div className="timing"><Clock /> <strong>Package Timing</strong>  10:00 AM – 5:00 PM (same day)</div>
              
            </div>
          </div>
        </div>
      </div>
      

      <Activities />
      <Gallery />
      <Testimonial />
      <LightboxGallery />
      <BlogHome />
    </>
  );
}
