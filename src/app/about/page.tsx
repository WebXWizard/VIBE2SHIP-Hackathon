import React from "react";
import HomeHero from "@/components/HomeHero";

const About = () => {
  return (
    <div>
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
      <section className="about-themis">
        <div className="background-overlay"></div>
        <div className="container1">
          <h2 className="section-title">About Themis</h2>
          <p className="section-text">
            Themis Mudhouse Resorts is amongst the most well-known luxury
            hospitality brands in India. We have been steadily growing our
            presence in North India with a chain of premium resorts that promise
            unique experiences to our esteemed guests. Our brand is
            predominantly renowned for providing bespoke staycations, comprising
            signature hospitality and great food, seamlessly blended to the
            backdrop of rustic ambiences that celebrate nature in an
            eco-friendly way. We strive to reach our goal of providing you with
            a stay that engages all your senses, to culminate into an indelible
            memory! Our skillfully crafted resorts stand testament to this
            promise, wherein we deliver the best of modern amenities and bring
            together the aesthetic of the yesteryears with the comfort of modern
            times under a single roof.
          </p>
        </div>
      </section>

      <section className="founder-story">
        <div className="founder-overlay"></div>
        <div className="founder-container">
          <div className="founder-content">
            <h2 className="founder-title">The Story of Our Founder</h2>
            <p className="founder-text">
              Our founder, Sumeet Dabas, took the first steps to building his
              hospitality empire with a restaurant that soon became one of Delhi
              most popular; pocket-friendly, yet luxurious barbeque dining
              experiences. This was the beginning of the Themis legacy, and it
              all began with Themis Barbecue House. Sumeet is regarded as one of
              the youngest and the brightest restaurateurs in India. At a young
              age, he realised the requirements in the dining industry, and
              brought a fine-dining and luxurious atmosphere to fruition. He
              executed his vision immaculately through Themis Barbecue House -
              Pitampura, NSP. Over time, Themis Barbecue House expanded to
              encompass new locations in Karnal (2021), and Ambala (2023). Each
              branch upholds the same standards and immersive experience that
              catapulted Themis Barbecue House to fame in Delhi. While Themis
              Barbecue House Karnal is temporarily closed, it will soon be
              reopening, but in the interim.
            </p>
          </div>
          <div className="founder-image-wrapper">
            <img
              src="https://assets.simplotel.com/simplotel/image/upload/x_0,y_0,w_1596,h_1600,r_0,c_crop,q_80,fl_progressive/w_500,f_auto,c_fit/themis-mudhouse-resorts/WhatsApp_Image_2022-04-13_at_2.39.26_PM_jyrcu7"
              alt="Sumeet Dabas, Founder of Themis"
              className="founder-image"
            />
          </div>
        </div>
      </section>

      <section className="founder-story">
        <div className="founder-container">
          <div className="founder-image-wrapper">
            <img
              src="https://assets.simplotel.com/simplotel/image/upload/x_0,y_0,w_1596,h_1600,r_0,c_crop,q_80,fl_progressive/w_500,f_auto,c_fit/themis-mudhouse-resorts/WhatsApp_Image_2022-04-13_at_2.39.26_PM_jyrcu7"
              alt="Sumeet Dabas, Founder of Themis"
              className="founder-image"
            />
          </div>
          <div className="founder-content">
            <h2 className="founder-title">The Story of Our Founder</h2>
            <p className="founder-text">
              Our founder, Sumeet Dabas, took the first steps to building his
              hospitality empire with a restaurant that soon became one of Delhi
              most popular; pocket-friendly, yet luxurious barbeque dining
              experiences. This was the beginning of the Themis legacy, and it
              all began with Themis Barbecue House. Sumeet is regarded as one of
              the youngest and the brightest restaurateurs in India. At a young
              age, he realised the requirements in the dining industry, and
              brought a fine-dining and luxurious atmosphere to fruition. He
              executed his vision immaculately through Themis Barbecue House -
              Pitampura, NSP. Over time, Themis Barbecue House expanded to
              encompass new locations in Karnal (2021), and Ambala (2023). Each
              branch upholds the same standards and immersive experience that
              catapulted Themis Barbecue House to fame in Delhi. While Themis
              Barbecue House Karnal is temporarily closed, it will soon be
              reopening, but in the interim.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
