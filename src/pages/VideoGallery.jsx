// src/pages/VideoGallery.jsx
import { useEffect, useState } from "react";
import api from "../api/axios";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const extractVideoUrl = (fulltext) => {
  if (!fulltext) return null;
  const match = fulltext.match(/https?:\/\/[^\s<"]+/);
  return match ? match[0] : null;
};

const getYoutubeThumbnail = (url) => {
  if (!url) return null;
  try {
    let videoId = null;
    if (url.includes("watch?v=")) {
      videoId = new URL(url).searchParams.get("v");
    } else if (url.includes("embed/")) {
      videoId = url.split("embed/")[1]?.split(/[?&]/)[0];
    } else if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1]?.split(/[?&]/)[0];
    }
    return videoId
      ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
      : null;
  } catch {
    return null;
  }
};

export default function VideoGallery() {
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [activeVideo, setActiveVideo] = useState(null);
  const limit = 6;

  useEffect(() => {
    api
      .get(`/posts?category_id=7&limit=${limit}&page=${page}`)
      .then((res) => {
        setVideos(res.data.data || []);
        setLastPage(res.data.last_page || 1);
      })
      .catch((err) => console.error(err));
  }, [page]);

  return (
    <section className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 max-w-7xl mx-auto px-3 mt-16 mb-3">
        <h2
          className="text-4xl font-extrabold animate-gradient 
          bg-gradient-to-r from-blue-500 via-yellow-400 to-green-500 bg-[length:200%_200%] drop-shadow-lg
          bg-clip-text text-transparent py-3 my-10 text-center"
        >
          ဗွီဒီယိုမှတ်တမ်းများ
        </h2>

        {/* Video Grid */}
        {videos.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            ❌ Video မရှိပါ
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((post, idx) => {
              const videoUrl = extractVideoUrl(post.fulltext);
              const thumb = getYoutubeThumbnail(videoUrl);

              return (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer group hover:shadow-xl transition"
                  onClick={() => setActiveVideo(videoUrl)}
                >
                  <div className="relative w-full aspect-video">
                    {thumb ? (
                      <img
                        src={thumb}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                        No Thumbnail
                      </div>
                    )}

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                      <div className="bg-white p-4 rounded-full shadow-lg">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 16 16"
                          className="w-8 h-8 text-red-600"
                        >
                          <path d="M6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l4.5-2.5a.5.5 0 0 0 0-.814l-4.5-2.5z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="px-4 py-3 text-center font-semibold text-lg text-gray-800 line-clamp-2 group-hover:text-blue-600 transition">
                    {post.title}
                  </h3>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center items-center mt-12 gap-3">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition"
          >
            ⬅ Previous
          </button>
          <span className="font-medium text-gray-700">
            Page {page} of {lastPage}
          </span>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, lastPage))}
            disabled={page === lastPage}
            className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition"
          >
            Next ➡
          </button>
        </div>
      </div>

      {/* Modal */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
          onClick={(e) => e.target === e.currentTarget && setActiveVideo(null)}
        >
          <div className="w-full max-w-4xl mx-4 relative animate-fadeIn">
            <button
              className="absolute -top-10 right-0 text-white text-4xl font-bold z-10 hover:text-red-400"
              onClick={() => setActiveVideo(null)}
            >
              &times;
            </button>
            <div className="w-full aspect-video rounded-lg overflow-hidden shadow-lg">
              <iframe
                src={`${activeVideo.replace("watch?v=", "embed/")}?autoplay=1`}
                title="video-player"
                width="100%"
                height="100%"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-lg"
              />
            </div>
          </div>
        </div>
      )}

      <Footer />
    </section>
  );
}
