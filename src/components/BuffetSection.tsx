import React from "react";
import AccordionItem from "./AccordionItem";

interface BuffetSectionProps {
  title: string;
  sections: {
    title: string;
    icon: string;
    time?: string;
    description?: string;
    items: { img: string; label: string }[];
    defaultOpen?: boolean;
  }[];
}

const BuffetSection: React.FC<BuffetSectionProps> = ({ title, sections }) => {
  return (
    <section className="py-4">
      <div className="container">
        <div className="col-12 mb-4">
          <h2>
            {title.split(" ")[0]} <b>{title.split(" ")[1]}</b>
          </h2>
        </div>

        <div className="accordion">
          {sections.map((section, index) => (
            <AccordionItem key={index} {...section} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BuffetSection;
