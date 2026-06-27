import React from "react";

interface DisclaimerSectionProps {
  title: string;
  items: string[];
}

const DisclaimerSection: React.FC<DisclaimerSectionProps> = ({
  title,
  items,
}) => {
  return (
    <section className="disclaimer py-4">
      <div className="container">
        <div className="row">
          <div className="col-12 text-left title mb-0">
            <h2>{title}</h2>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <ul className="ListIn">
              {items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DisclaimerSection;
