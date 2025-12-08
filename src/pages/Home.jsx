// import HeroBanner from "../components/HeroBanner";
// import Highlights from "../components/Highlights";
// import NewsAndUpdates from "../components/NewsAndUpdates";
// import Features from "../components/Features";
// import Footer from "../components/Footer";
// import Navbar from "../components/Navbar";
// import ImageSlide from "../components/ImageSlide";
// import FeaturesBotton from "../components/FeaturesBotton";

// export default function Home() {

//   return (
//     <div className="font-sans">
//       <Navbar />
//       <HeroBanner />
//       <Highlights />
//       <NewsAndUpdates />
//       <ImageSlide />
//       <Features />
//       <FeaturesBotton />
//       <Footer />
//     </div>
//   );
// }

import { useLocation } from "react-router-dom";
import HeroBanner from "../components/HeroBanner";
import Highlights from "../components/Highlights";
import NewsAndUpdates from "../components/NewsAndUpdates";
import Features from "../components/Features";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import ImageSlide from "../components/ImageSlide";
import FeaturesBotton from "../components/FeaturesBotton";

export default function Home({ lang }) {
  const location = useLocation();

  // Auto detect if prop not provided
  const currentLang = lang || (location.pathname.startsWith("/en") ? "en" : "mm");

  return (
    <div className="font-sans">
      <Navbar lang={currentLang} />
      <HeroBanner lang={currentLang} />
      <Highlights lang={currentLang} />
      <NewsAndUpdates lang={currentLang} />
      <ImageSlide lang={currentLang} />
      <Features lang={currentLang} />
      <FeaturesBotton lang={currentLang} />
      <Footer lang={currentLang} />
    </div>
  );
}

