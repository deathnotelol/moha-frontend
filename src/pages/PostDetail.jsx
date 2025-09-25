import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Slider from "react-slick";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await api.get(`/posts/${id}`);
        setPost(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPost();
  }, [id]);

  if (!post) return <p className="text-center py-20">Loading...</p>;

  const images = Array.isArray(post.all_images) ? post.all_images : [];

  /** 
   * Strip out <img> tags and centered captions (<div style="text-align:center">…</div>)
   */
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

    // Optionally remove empty spans/divs left over
    cleaned = cleaned.replace(/<div[^>]*>\s*<\/div>/gi, "");

    return cleaned;
  };

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: images.length < 2 ? 1 : 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: true,
    adaptiveHeight: true,
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 mt-20">
        <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
          {/* Title */}
          <h1 className="text-2xl font-bold mb-6 text-center leading-snug">
            {post.title}
          </h1>

          {/* Slideshow */}
          {images.length > 0 && (
            <div className="mb-6 shadow-md rounded-lg overflow-hidden">
              <Slider {...settings}>
                {images.map((img, idx) => (
                  <div key={idx} className="flex justify-center bg-white">
                    <img
                      src={`https://10.10.6.15/moha-api/public/${img}`}
                      alt={`${post.title}-${idx}`}
                      className="rounded-lg max-h-[500px] mx-auto object-contain"
                    />
                  </div>
                ))}
              </Slider>
            </div>
          )}

          {/* Meta info */}
          <h3 className="text-sm text-blue-700 font-semibold mb-3 text-right">
            Published: {formatDate(post.published_at)}
          </h3>

          <div className="border-b border-gray-300 mb-6"></div>

          {/* Fulltext without images and captions */}
          <div
            className="prose max-w-none text-[18px] leading-relaxed text-justify"
            dangerouslySetInnerHTML={{ __html: cleanFulltext(post.fulltext) }}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PostDetail;
