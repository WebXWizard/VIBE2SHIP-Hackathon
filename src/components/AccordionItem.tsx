import React, { useState } from "react";

interface MenuItem {
  img: string;
  label: string;
}

interface AccordionItemProps {
  title: string;
  icon: string;
  time?: string;
  description?: string;
  items: MenuItem[];
  defaultOpen?: boolean;
}

const AccordionItem: React.FC<AccordionItemProps> = ({
  title,
  icon,
  time,
  description,
  items,
  defaultOpen = false,
}) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="accordion-item border-bottom">
      <h2
        className="accordion-header d-flex align-items-center justify-content-between p-3 pb-0 cursor-pointer"
        onClick={() => setOpen(!open)}
        style={{ cursor: "pointer" }}
      >
        <h4 className="accordion-title d-flex align-items-center gap-4">
          <img src={icon} alt={title} className="icon-new" />
          {title}
        </h4>
        <span className="icon">{open ? "−" : "+"}</span>
      </h2>

      {open && (
        <div className="accordion-content p-3">
          {time && <h4 className="pt-2 date_new">{time}</h4>}
          {description && <p>{description}</p>}
          <ul className="list-unstyled row g-3 pt-2">
            {items.map((item, i) => (
              <li
                key={i}
                className="col-6 col-md-4 col-lg-2 d-flex flex-column align-items-center text-center"
              >
                <img
                  src={item.img}
                  alt={item.label}
                  className="img-fluid mb-2 rounded shadow-sm"
                />
                <p>{item.label}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AccordionItem;
