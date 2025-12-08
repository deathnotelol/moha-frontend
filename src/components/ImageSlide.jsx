

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

// wrap function
const wrap = (min, max, val) => {
  const range = max - min;
  return ((((val - min) % range) + range) % range) + min;
};

// MM Slides
const slidesMM = [
  {
    id: 1,
    img: process.env.PUBLIC_URL + "/images/slide/mpf.jpg",
    description: "မြန်မာနိုင်ငံရဲတပ်ဖွဲ့",
  },
  {
    id: 2,
    img: process.env.PUBLIC_URL + "/images/slide/GAD.jpg",
    description: "အထွေထွေအုပ်ချုပ်ရေးဦးစီးဌာန",
  },
  {
    id: 3,
    img: process.env.PUBLIC_URL + "/images/slide/BSI.jpg",
    description: "အထူးစုံစမ်းစစ်ဆေးရေးဦးစီးဌာန",
  },
  {
    id: 4,
    img: process.env.PUBLIC_URL + "/images/slide/pd.jpg",
    description: "အကျဉ်းဦးစီးဌာန",
  },
  {
    id: 5,
    img: process.env.PUBLIC_URL + "/images/slide/fsd.jpg",
    description: "မီးသတ်ဦးစီးဌာန",
  },
];

// EN Slides
const slidesEN = [
  {
    id: 1,
    img: process.env.PUBLIC_URL + "/images/slide/mpf.jpg",
    description: "Myanmar Police Force",
  },
  {
    id: 2,
    img: process.env.PUBLIC_URL + "/images/slide/GAD.jpg",
    description: "General Administration Department",
  },
  {
    id: 3,
    img: process.env.PUBLIC_URL + "/images/slide/BSI.jpg",
    description: "Bureau of Special Investigation",
  },
  {
    id: 4,
    img: process.env.PUBLIC_URL + "/images/slide/pd.jpg",
    description: "Prisons Department",
  },
  {
    id: 5,
    img: process.env.PUBLIC_URL + "/images/slide/fsd.jpg",
    description: "Fire Services Department",
  },
];

export default function ImageSlide() {
  const location = useLocation();
  const isMM = location.pathname.startsWith("/mm");

  const slides = isMM ? slidesMM : slidesEN;

  const [[page, direction], setPage] = useState([0, 0]);
  const slideIndex = wrap(0, slides.length, page);

  const paginate = (newDirection) => {
    setPage(([prevPage]) => [prevPage + newDirection, newDirection]);
  };

  useEffect(() => {
    const timer = setInterval(() => paginate(1), 5000);
    return () => clearInterval(timer);
  }, []);

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  return (
    <div className="relative w-full h-[70vh] overflow-hidden">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={page}
          className="absolute inset-0 w-full h-full"
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <img
            src={slides[slideIndex].img}
            className="w-full h-[70vh] object-cover"
            alt="slide"
          />

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 
            bg-white/10 backdrop-blur-lg px-8 py-5 rounded-2xl border-white/20"
          >
            <h3 className="text-3xl font-extrabold text-white drop-shadow-md">
              {slides[slideIndex].description}
            </h3>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      <button
        onClick={() => paginate(-1)}
        className="absolute top-1/2 left-5 bg-black/50 text-white p-2 rounded-full"
      >
        ◀
      </button>
      <button
        onClick={() => paginate(1)}
        className="absolute top-1/2 right-5 bg-black/50 text-white p-2 rounded-full"
      >
        ▶
      </button>

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setPage([idx, idx > slideIndex ? 1 : -1])}
            className={`w-3 h-3 rounded-full ${
              idx === slideIndex ? "bg-white" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
