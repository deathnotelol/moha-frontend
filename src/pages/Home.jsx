import HeroBanner from "../components/HeroBanner";
import Highlights from "../components/Highlights";
import NewsAndUpdates from "../components/NewsAndUpdates";
import Features from "../components/Features";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import ImageSlide from "../components/ImageSlide";


export default function Home() {
  return (
    <div className="font-sans">
      <Navbar />
      <HeroBanner />
      <Highlights />
      <NewsAndUpdates />
      <ImageSlide />
      <Features />
      <Footer />
    </div>
  );
}
