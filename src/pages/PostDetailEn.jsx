import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Slider from "react-slick";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const PostDetailEn = () => {
  const { id } = useParams(); // Myanmar post UUID
  const [post, setPost] = useState(null);
  const [images, setImages] = useState([]);
  const placeholderImg = "/images/Web.jpg";

  // Clean HTML fulltext
  const cleanFulltext = (html) => {
    if (!html) return "";
    let cleaned = html;
    cleaned = cleaned.replace(/<img[^>]*>/gi, ""); // remove images
    cleaned = cleaned.replace(
      /<div[^>]*text-align\s*:\s*center[^>]*>[\s\S]*?<\/div>/gi,
      ""
    );
    cleaned = cleaned.replace(/<div[^>]*>\s*<\/div>/gi, "");
    cleaned = cleaned.replace(
      /href="(images\/[^"]+)"/g,
      'href="https://192.168.110.15/moha-api/public/storage/uploads/$1"'
    );
    return cleaned;
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`/en/posts/${id}`); // fetch EN post by Myanmar UUID
        const postData = res.data;
        if (!postData) throw new Error("EN Post not found");

        setPost(postData);

        const rawImages = Array.isArray(postData.all_images)
          ? postData.all_images
          : [];
        const uniqueImages =
          rawImages.length > 0
            ? [...new Set(rawImages.map((img) => img.split("#")[0].trim()))]
            : [placeholderImg];

        setImages(uniqueImages);
      } catch (err) {
        console.error("Failed to fetch EN post:", err);
        setImages([placeholderImg]);
      }
    };

    if (id) fetchPost();
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    return `${String(d.getDate()).padStart(2, "0")}-${String(
      d.getMonth() + 1
    ).padStart(2, "0")}-${d.getFullYear()}`;
  };

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
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  if (!post)
    return <p className="text-center py-20 text-gray-500">Loading...</p>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar lang="en" />
      <main className="flex-1 mt-24 w-full">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-white shadow-xl rounded-2xl p-6 md:p-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center leading-snug">
              {post.title}
            </h1>

            {images.length > 0 && (
              <div className="mb-8 rounded-xl overflow-hidden shadow-md">
                <Slider {...sliderSettings}>
                  {images.map((img, idx) => (
                    <div key={idx} className="flex justify-center bg-black/5 p-2">
                      <img
                        src={
                          img === placeholderImg
                            ? placeholderImg
                            : `https://192.168.110.15/moha-api/public/${img}`
                        }
                        alt={`${post.title}-${idx}`}
                        className="rounded-xl max-h-[500px] w-auto mx-auto object-contain transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                  ))}
                </Slider>
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
              className="joomla-content prose max-w-none text-justify"
              dangerouslySetInnerHTML={{ __html: cleanFulltext(post.fulltext) }}
            />
          </div>
        </div>
      </main>
      <Footer lang="en" />
    </div>
  );
};

export default PostDetailEn;
