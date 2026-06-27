"use client";

import React, { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface ImageItem {
  src: string;
  alt: string;
  title: string;
}

const IMAGES: ImageItem[] = [
  { src: "/images/wild/wild_02.jpeg", alt: "wildlife image 2", title: " " },
  { src: "/images/wild/wild_03.jpeg", alt: "wildlife image 3", title: " " },
  { src: "/images/wild/wild_04.jpeg", alt: "wildlife image 4", title: " " },
  { src: "/images/wild/wild_05.jpeg", alt: "wildlife image 5", title: " " },
  { src: "/images/wild/wild_01.jpeg", alt: "wildlife image 1", title: "Naseeruddin Shah" },
  { src: "/images/wild/wild_09.jpeg", alt: "wildlife image 9", title: "Vidya Balan" },
  { src: "/images/wild/wild_06.jpeg", alt: "wildlife image 6", title: " " },
  { src: "/images/wild/wild_07.jpeg", alt: "wildlife image 7", title: " " },
  { src: "/images/wild/wild_12.jpeg", alt: "wildlife image 12", title: "" },
  { src: "/images/wild/wild_10.jpeg", alt: "wildlife image 10", title: "Ali Zafar" },
  { src: "/images/wild/wild_13.jpeg", alt: "wildlife image 13", title: " " },
];

export default function LightboxGallery() {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const openAt = useCallback((i: number) => {
    setIndex(i);
    setOpen(true);
  }, []);

  const close = useCallback(() => setOpen(false), []);
  const prev = useCallback(() => setIndex((i) => (i - 1 + IMAGES.length) % IMAGES.length), []);
  const next = useCallback(() => setIndex((i) => (i + 1) % IMAGES.length), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close, prev, next]);

  return (
    <div className="space">
      <div className="container">
        <div className="title text-center mb-4">
          <h2>Mudfort at Serial and Movies</h2>
        </div>

        <div className="serial">
          {IMAGES.map((img, i: number) => (

              <div
              className="item"
              key={i}
                onClick={() => openAt(i)}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  title={img.title}
                  className="full rounded"
                  style={{ objectFit: "cover", width: "100%", height: "100%" }}
                />
              </div>
          ))}
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-75"
              style={{ zIndex: 1050 }}
              onClick={close}
            >
              <motion.div
                key="dialog"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="position-relative d-flex align-items-center justify-content-center"
                style={{ maxWidth: "90%", maxHeight: "85%" }}
                onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
              >
                <button
                  onClick={prev}
                  className="btn btn-light position-absolute start-0 top-50 translate-middle-y m-2"
                >
                  <ChevronLeft />
                </button>

                <motion.img
                  key={IMAGES[index].src}
                  src={IMAGES[index].src}
                  alt={IMAGES[index].alt}
                  className="img-fluid rounded shadow"
                  style={{ maxHeight: "85vh", maxWidth: "100%" }}
                  onClick={next}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                />

                <button
                  onClick={next}
                  className="btn btn-light position-absolute end-0 top-50 translate-middle-y m-2"
                >
                  <ChevronRight />
                </button>

                <button
                  onClick={close}
                  className="btn btn-light position-absolute end-0 top-0 m-2"
                >
                  <X />
                </button>

                <div className="position-absolute bottom-0 start-50 translate-middle-x bg-dark bg-opacity-50 text-white px-2 py-1 rounded">
                  {index + 1} / {IMAGES.length}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
