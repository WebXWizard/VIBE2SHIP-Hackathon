"use client";
import GalleryPage from "@/components/GalleryPage";
import HomeHero from "@/components/HomeHero";
import Promotion from "@/components/Promotion";
import SingleSwiper from "@/components/SingleSwiper";
import BigLeftSlider from "@/components/BigLeftSwiper"; // Keep this import
import {
  AlignHorizontalSpaceBetween,
  Bed,
  BedDouble,
  Bike,
  Bird,
  BriefcaseConveyorBelt,
  BrushCleaning,
  Cat,
  CircleChevronRight,
  Coffee,
  Dog,
  Fan,
  Flame,
  Gem,
  Heater,
  LandPlot,
  MicVocal,
  Music,
  PartyPopper,
  Projector,
  ShieldHalf,
  Toilet,
  TreePalm,
  WavesLadder,
  Wifi,
  Wine,
} from "lucide-react";
import { PhotoProvider } from "react-photo-view";
import Link from "next/link";

function page() {
  return (
    <>
      <HomeHero
        bgImage="/images/acti4.jpg"
        heading="Checkout all the Activities"
        subHeading="Check our Latest Seasional Promotions"
        link="Check All Rooms"
      />

      <section className="activities-section">
        <div className="container">
          <h2>
            Bring Out Adrenaline Junkie &amp; Try More Than 50 Complimentary
            Activities
          </h2>
          <p>
            With over 50 activities on offer we have something or the other on
            offer for all age groups! Try your hand at some rural activities
            like archery, pottery, rajasthani dance or jump right into the
            adventure with Rope Course, Zipline, Body Zorbing. For summers there
            is swimming pool and rain shower also available. Check out the list
            below!
          </p>

          <div className="stats-grid">
            <div className="stat-item">
              <LandPlot />
              <h3>17+</h3>
              <span>Acres of Land</span>
            </div>

            <div className="stat-item">
              <TreePalm />
              <h3>75k+</h3>
              <span>Plants and Trees</span>
            </div>

            <div className="stat-item">
              <Bike />
              <h3>50+</h3>
              <span>Activities and Sports</span>
            </div>

            <div className="stat-item">
              <Bird />
              <h3>25+</h3>
              <span>Bird Species</span>
            </div>

            <div className="stat-item">
              <Cat />
              <h3>Agroforestry</h3>
              <span>and Gaushala</span>
            </div>

            <div className="stat-item">
              <WavesLadder />
              <h3>Rain Shower</h3>
              <span>&amp; Swimming Pool</span>
            </div>
          </div>
        </div>
      </section>

      <section className="village mb-5">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6">
              <SingleSwiper
                slidesPerView={1}
                autoplayDelay={4000}
                images={[
                  "/images/activity/4.jpg",
                  "/images/activity/5.jpg",
                  "/images/activity/6.jpg",
                  "/images/activity/7.jpg",
                ]}
              />
            </div>
            <div className="col-lg-6">
              <h3>Village Activities</h3>
              <p>
                Meet the villagers enjoying their daily life showcasing their
                skill and art as they welcome you with open arms to witness the
                same. You are invited!
              </p>
              <ul>
                <li>
                  <CircleChevronRight /> Charkha
                </li>
                <li>
                  <CircleChevronRight /> Atta Chaki
                </li>
                <li>
                  <CircleChevronRight /> Bhool
                </li>
                <li>
                  <CircleChevronRight /> Kanche Goli
                </li>
                <li>
                  <CircleChevronRight /> Dhol
                </li>
                <li>
                  <CircleChevronRight /> Matki Phod
                </li>
                <li>
                  <CircleChevronRight /> Lattu
                </li>
                <li>
                  <CircleChevronRight /> Bhulaiya
                </li>
                <li>
                  <CircleChevronRight /> Rajasthani Folk Dance and Music
                </li>
                <li>
                  <CircleChevronRight /> Raam Jhool
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="amenities space">
        <div className="container">
          <div className="title text-center">
            <span>A Nature Lovers Delight</span>
            <h2>Add on Amenities</h2>
            <p>
              Add special services as per your requirements for your outing
              package near Delhi
            </p>
          </div>
          <div className="row g-5 align-items-center">
            <div className="col-lg-6">
              <BigLeftSlider
                images={[
                  "/images/acti3.jpg",
                  "/images/acti5.jpg",
                  "/images/acti4.jpg",
                  "/images/acti8.jpg",
                ]}
              />
            </div>
            <div className="col-lg-6">
              <ul className="two-col-list">
                <li>
                  <Flame /> Bone fire in Winters
                </li>
                <li>
                  <ShieldHalf /> Team Building with Props
                </li>
                <li>
                  <Wine /> Liquor with License
                </li>
                <li>
                  <PartyPopper /> Balloon Decorations and Special occasions
                </li>
                <li>
                  <Music /> DJ Music
                </li>
                <li>
                  <MicVocal /> Karaoke Singing
                </li>
                <li>
                  <Projector /> Conference and Meetings
                </li>
                <li>
                  <Gem /> We are Available for any Special Requirements
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="village mb-5">
        <div className="container">
          <div className="title text-center">
            <h2>Games</h2>
          </div>
          <div className="row g-5 align-items-center">
            <div className="col-lg-12">
              <SingleSwiper
                slidesPerView={1}
                autoplayDelay={4000}
                images={[
                  "/images/activity/cricket/1.jpg",
                  "/images/activity/cricket/2.jpg",
                  "/images/activity/cricket/3.jpg",
                  "/images/activity/cricket/4.jpg",
                  "/images/activity/cricket/5.jpg",
                  "/images/activity/cricket/6.jpg",
                  "/images/activity/cricket/7.jpg",
                ]}
              />
            </div>
            <div className="col-lg-6">
              <h3>Cricket</h3>
              <p>
                Meet the villagers enjoying their daily life showcasing their
                skill and art as they welcome you with open arms to witness the
                same. You are invited!
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default page;
