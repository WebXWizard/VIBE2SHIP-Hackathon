"use client";
import BuffetSection from "@/components/BuffetSection";
import DisclaimerSection from "@/components/DisclaimerSection";
import HomeHero from "@/components/HomeHero";
import ThreeSlider from "@/components/ThreeSlider";
import Link from "next/link";

const page = () => {
  const foodImages = [
    "/images/gallery/6R6A0631.webp",
    "/images/gallery/6R6A0637.webp",
  ];

  const buffetData = [
    // your same buffetData content
  ];

  return (
    <>
      {/* ✅ Add spacing above/below slider */}
      <section className="">
        <ThreeSlider images={foodImages} title="Restaurant Specialties" />
      </section>

      {/* ✅ Title + Description Section */}
      <section className="">
        <div className="container">
          <div className="title  max-w-4xl mx-auto">
            <h2 className="mb-4">
              Dine at Karma Lakelands: One of the Best Places to Eat in Gurgaon
            </h2>
            <p className="leading-relaxed">
              Karma Lakelands aims to offer phenomenal culinary gratification at
              its restaurants. Offering three of the best places to eat in
              Gurgaon and an option to choose your preferred location for
              private dining, this is a dining experience you will not forget!
              To know more about our restaurants, drool at the foodgasmic
              pictures, and to keep up to date, follow us on our Instagram page.
            </p>
          </div>
        </div>
      </section>

      {/* ✅ Disclaimer Section */}
      <section className="">
        <DisclaimerSection
          title="Note"
          items={[
            "Food is included in the price of your package. However, extra price may be charged for some food items/ drinks.",
            "The Menu is subject to change without prior notice and may vary based on season.",
            "Food is available only during the time mentioned above. Guests are requested to follow the schedule for all meals in order for us to serve you without any sense of urgency.",
            "Rurban Resort management however, reserves the right to decline services or levy additional charges in case the guests do not avail of their meals within prescribed time slots.",
            "Please make the attendant aware of your allergies, if any.",
            "Outside food shall not be allowed.",
            "*Any one available at Chef’s Selection.",
          ]}
        />
      </section>
    </>
  );
};

export default page;
