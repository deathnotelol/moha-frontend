import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Slider from "react-slick";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [images, setImages] = useState([]);

  const placeholderImg = "/no-image.png"; // public/no-image.png

  // ✅ Clean + Fix Links
  const cleanFulltext = (html) => {
    if (!html) return "";
    let cleaned = html;

    // Remove all <img> tags
    cleaned = cleaned.replace(/<img[^>]*>/gi, "");

    // Remove center-aligned captions or empty centered divs
    cleaned = cleaned.replace(
      /<div[^>]*text-align\s*:\s*center[^>]*>[\s\S]*?<\/div>/gi,
      ""
    );

    // Remove empty spans/divs
    cleaned = cleaned.replace(/<div[^>]*>\s*<\/div>/gi, "");

    // ✅ Fix relative href="images/...." → absolute API path
    cleaned = cleaned.replace(
      /href="(images\/[^"]+)"/g,
      'href="https://10.10.6.15/moha-api/public/storage/uploads/$1"'
    );

    return cleaned;
  };

  const fetchPost = async () => {
    try {
      const res = await api.get(`/posts/${id}`);
      setPost(res.data);

      const rawImages = Array.isArray(res.data.all_images) ? res.data.all_images : [];
      const normalizedImages = rawImages
        .map((img) => img.split("#")[0].replace(/%20/g, " ").trim())
        .filter((img) => img && img !== "");
      const uniqueImages = [...new Set(normalizedImages)];
      setImages(uniqueImages);
    } catch (err) {
      console.error("Failed to fetch post", err);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return `${String(d.getDate()).padStart(2, "0")}-${String(d.getMonth() + 1).padStart(2, "0")}-${d.getFullYear()}`;
  };

  if (!post) return <p className="text-center py-20 text-gray-500">Loading...</p>;

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: true,
    adaptiveHeight: true,
    swipeToSlide: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } }
    ]
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-1 mt-24 w-full">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-white shadow-xl rounded-2xl p-6 md:p-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center leading-snug">
              {post.title}
            </h1>

            {images.length > 0 ? (
              <div className="mb-8 rounded-xl overflow-hidden shadow-md">
                <Slider {...sliderSettings}>
                  {images.map((img, idx) => (
                    <div key={idx} className="flex justify-center bg-black/5 p-2">
                      <img
                        src={`https://10.10.6.15/moha-api/public/${img}`}
                        alt={`${post.title}-${idx}`}
                        className="rounded-xl max-h-[500px] w-auto mx-auto object-contain transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                  ))}
                </Slider>
              </div>
            ) : (
              <div className="mb-8 flex justify-center">
                <img
                  src={placeholderImg}
                  alt="No Image"
                  className="rounded-xl max-h-[400px] mx-auto object-contain opacity-70"
                />
              </div>
            )}

            <div className="text-right text-sm text-gray-600 mb-6">
              Published:{" "}
              <span className="font-medium text-blue-700">
                {formatDate(post.published_at)}
              </span>
            </div>
            <div className="border-b border-gray-200 mb-6"></div>

            <div
              className="prose max-w-none prose-p:leading-relaxed prose-headings:text-gray-800 prose-a:text-blue-600 hover:prose-a:underline text-justify"
              dangerouslySetInnerHTML={{ __html: cleanFulltext(post.fulltext) }}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PostDetail;
