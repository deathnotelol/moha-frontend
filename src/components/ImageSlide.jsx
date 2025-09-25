import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Wrap function without popmotion
const wrap = (min, max, val) => {
  const range = max - min;
  return ((val - min) % range + range) % range + min;
};

const slides = [
  {
    id: 1,
    img: "/images/slide/mpf.jpg",
    description: "မြန်မာနိုင်ငံရဲတပ်ဖွဲ့",
  },
  {
    id: 2,
    img: "/images/slide/GAD.jpg",
    description: "အထွေထွေအုပ်ချုပ်ရေးဦးစီးဌာန",
  },
  {
    id: 3,
    img: "/images/slide/BSI.jpg",
    description: "အထူးစုံစမ်းစစ်ဆေးရေးဦးစီးဌာန",
  },
  {
    id: 4,
    img: "/images/slide/pd.jpg",
    description: "အကျဉ်းဦးစီးဌာန",
  },
  {
    id: 5,
    img: "/images/slide/fsd.jpg",
    description: "မီးသတ်ဦးစီးဌာန",
  },
];

export default function ImageSlide() {
  const [[page, direction], setPage] = useState([0, 0]);
  const slideIndex = wrap(0, slides.length, page);

  const paginate = (newDirection) => {
    setPage(([prevPage]) => [prevPage + newDirection, newDirection]);
  };

  // Auto slide every 5 seconds
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

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => Math.abs(offset) * velocity;

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
          transition={{ duration: 0.8 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);
            if (swipe < -swipeConfidenceThreshold) paginate(1);
            else if (swipe > swipeConfidenceThreshold) paginate(-1);
          }}
        >
          <img
            src={slides[slideIndex].img}
            alt={`slide-${slides[slideIndex].id}`}
            className="w-full h-[70vh] object-cover"
          />
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-6 py-3 rounded-md">
            {slides[slideIndex].description}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Left / Right arrows */}
      <button
        className="absolute top-1/2 left-5 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
        onClick={() => paginate(-1)}
      >
        ◀
      </button>
      <button
        className="absolute top-1/2 right-5 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
        onClick={() => paginate(1)}
      >
        ▶
      </button>

      {/* Dots navigation */}
      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() =>
              setPage([idx, idx > slideIndex ? 1 : -1])
            }
            className={`w-3 h-3 rounded-full ${
              idx === slideIndex ? "bg-white" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
