import React from "react";
import HomeHero from "@/components/HomeHero";
import Link from "next/link";

const Event = () => {
  return (
    <div>
      {/* <section className="banner"></section> */}
      <HomeHero
        bgImage="/images/hero1.jpg"
        heading={
          <>
            Suites & <br /> Apartments
          </>
        }
        subHeading="Check our Latest Seasional Promotions"
        link="Check All Rooms"
      />
      <section className="event-section">
        <div className="event-card-container">
          <div className="event-card">
            <div className="event-image-wrapper">
              <img
                src="/images/acti5.jpg"
                alt="Weddings"
                className="event-image"
              />
              <Link href="/activities">
                <button className="event-btn">KNOW MORE</button>
              </Link>
            </div>
            <div className="event-content">
              <h3>Weddings</h3>
              <p>
                Exchange rings or tie the knot with your beloved at our grand
                banquet hall in Delhi NCR! We offer spacious green lawns with
                the perfect ambience to make your day merrier.
              </p>
            </div>
          </div>

          <div className="event-card">
            <div className="event-image-wrapper">
              <img
                src="/images/acti6.jpg"
                alt="Corporate Offsites"
                className="event-image"
              />
            <Link href="/activities">
                <button className="event-btn">KNOW MORE</button>
              </Link>
            </div>
            <div className="event-content">
              <h3>Corporate Offsites</h3>
              <p>
                We offer picture-perfect destinations for corporate functions,
                conferences, and off-site retreats that blend work and
                relaxation.
              </p>
            </div>
          </div>

          <div className="event-card">
            <div className="event-image-wrapper">
              <img
                src="/images/acti7.jpg"
                alt="Shoots"
                className="event-image"
              />
              <Link href="/activities">
                <button className="event-btn">KNOW MORE</button>
              </Link>
            </div>
            <div className="event-content">
              <h3>Shoots</h3>
              <p>
                Tell your story better with scenic backdrops and serene beauty —
                perfect for music videos, ads, and movie shoots with natural
                lighting.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Event;
