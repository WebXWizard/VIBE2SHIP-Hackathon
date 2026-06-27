"use client";

import { useState } from "react";
import {
  Bed,
  BedDouble,
  BrushCleaning,
  Clock4,
  HandCoins,
  PhoneCall,
  Shirt,
  SquareCheckBig,
  WashingMachine,
} from "lucide-react";

export default function Facilities() {
  const [activeTab, setActiveTab] = useState("nav-three"); // default open tab

type Tab = { id: TabId; label: string; title: string };

const tabs: Tab[] = [
  { id: "nav-one", label: "Property Amenities", title: "Property Amenities" },
  { id: "nav-two", label: "Room Amenities", title: "Room Amenities" },
  { id: "nav-three", label: "Resort Services", title: "Resort Services" },
  { id: "nav-four", label: "Outdoor Activities", title: "Outdoor Activities" },
  { id: "nav-five", label: "Indoor Activities", title: "Indoor Activities" },
  {
    id: "nav-six",
    label: "Village Experiences Around the Fort",
    title: "Village Experiences Around the Fort",
  },
];

  // amenity data grouped by tab id
  type Amenity = { icon: React.ReactNode; text: string };
type TabId =
  | "nav-one"
  | "nav-two"
  | "nav-three"
  | "nav-four"
  | "nav-five"
  | "nav-six";

const amenitiesData: Record<TabId, Amenity[]> = {
  "nav-one": [
    { icon: <SquareCheckBig />, text: "Outdoor swimming pool" },
    { icon: <SquareCheckBig />, text: "Landscaped lawns & courtyards" },
    { icon: <SquareCheckBig />, text: "Banquet and event spaces" },
    { icon: <SquareCheckBig />, text: "18th-century architecture with heritage charm" },
  ],
  "nav-two": [
    { icon: <SquareCheckBig />, text: "Air-conditioning & power back up" },
    { icon: <SquareCheckBig />, text: "Complimentary toiletries" },
    { icon: <SquareCheckBig />, text: "Hair dryers & ironing on request" },
    { icon: <SquareCheckBig />, text: "Luggage storage" },
  ],
  "nav-three": [
    { icon: <SquareCheckBig />, text: "Concierge & guided experiences" },
    { icon: <SquareCheckBig />, text: "Event & wedding planning assistance" },
    { icon: <SquareCheckBig />, text: "First aid box and fire extinguishers " },
    { icon: <SquareCheckBig />, text: "Indoor and Outdoor activities area " },
  ],
  "nav-four": [
    { icon: <SquareCheckBig />, text: "Pottery making" },
    { icon: <SquareCheckBig />, text: "Badminton " },
    { icon: <SquareCheckBig />, text: "Traditional bullock cart rides & tractor rides" },
    { icon: <SquareCheckBig />, text: "Seasonal bonfires & barbeque evenings" },
    { icon: <SquareCheckBig />, text: "Excursions to Brijghat on the Ganges (self-drive, boat ride available)" },
  ],
  "nav-five": [
    { icon: <SquareCheckBig />, text: "•	Table tennis " },
    { icon: <SquareCheckBig />, text: "•	Board games such as Carom, Chess, Ludo" },
    { icon: <SquareCheckBig />, text: "•	Tambola " },
    { icon: <SquareCheckBig />, text: "•	Rangoli making" },
  ],
  "nav-six": [
    { icon: <SquareCheckBig />, text: "Visit to Brijghat on the Ganges (25 km, self-drive)" },
    { icon: <SquareCheckBig />, text: "Traditional bullock cart rides & tractor rides" },
    { icon: <SquareCheckBig />, text: "Village visits and farm experiences " },
    { icon: <SquareCheckBig />, text: "Explore the local village market " },
  ],
};

  // render amenities for the active tab
  const renderAmenities = (tabId: TabId) => (
  <div className="tab_amenities">
    {amenitiesData[tabId].map((item, i) => (
      
        <div className="ser" key={i}>
          {item.icon}
          <p>{item.text}</p>
      
      </div>
    ))}
  </div>
);

  return (
    <div className="facilities space">
      <div className="container">
        <img src="/images/facilities.jpg" alt="Facilities" className="f_image" />
</div>
        <div className="fatured_amenities">
          <div className="container"><h2 className="title">Featured Amenities on the Site</h2></div>

          {/* Tabs */}
          <nav>
            <div className="nav nav-tabs justify-content-center px-5" role="tablist">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`nav-link ${activeTab === tab.id ? "active" : ""}`}
                  onClick={() => setActiveTab(tab.id)}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab.id}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </nav>

          {/* Tab content */}
         <div className="container">
           <div className="tab-content mt-3">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className={`tab-pane fade ${activeTab === tab.id ? "show active" : ""}`}
                role="tabpanel"
              >
                <div className="info">
                  <h3>{tab.title}</h3>
                  {renderAmenities(tab.id)}
                </div>
              </div>
            ))}
          </div>
         </div>
        </div>
      
    </div>
  );
}
