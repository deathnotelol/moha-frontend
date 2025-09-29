import { useEffect, useState } from "react";
import api from "../api/axios";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Features() {
  const [announcements, setAnnouncements] = useState([]);
  const [videos, setVideos] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);

  useEffect(() => {
    fetchPostsByCategory(5);
    fetchPostsByCategory(7);
  }, []);

  const fetchPostsByCategory = async (categoryId) => {
    try {
      const res = await api.get(`/posts?category_id=${categoryId}&limit=4`);
      const data = res.data.data || [];

      if (categoryId === 5) setAnnouncements(data);
      if (categoryId === 7) setVideos(data.slice(0, 4));
    } catch (err) {
      console.error(err);
    }
  };

  // extract first video URL from fulltext
  const extractVideoUrl = (fulltext) => {
    if (!fulltext) return null;
    const match = fulltext.match(/https?:\/\/[^\s<"]+/);
    return match ? match[0] : null;
  };

  // get YouTube thumbnail
  const getYoutubeThumbnail = (url) => {
    if (!url) return null;
    try {
      let videoId = null;

      // Watch link: https://www.youtube.com/watch?v=ID
      if (url.includes("watch?v=")) {
        videoId = new URL(url).searchParams.get("v");
      }

      // Embed link: https://www.youtube.com/embed/ID
      else if (url.includes("embed/")) {
        videoId = url.split("embed/")[1]?.split(/[?&]/)[0];
      }

      // Short link: https://youtu.be/ID
      else if (url.includes("youtu.be/")) {
        videoId = url.split("youtu.be/")[1]?.split(/[?&]/)[0];
      }

      return videoId
        ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
        : null;
    } catch {
      return null;
    }
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Announcements */}
          <div className="flex flex-col justify-between h-full">
            <div>
              <h3
                className="text-3xl font-extrabold animate-gradient 
                bg-gradient-to-r from-blue-500 via-yellow-400 to-green-500 bg-[length:200%_200%] drop-shadow-lg
                bg-clip-text text-transparent py-3 mb-5 text-center"
              >
                ထုတ်ပြန်ကြေငြာချက်များ
              </h3>

              <ul className="space-y-4">
                {announcements.map((post) => (
                  <li
                    key={post.id}
                    className="flex items-center justify-between bg-white p-3 rounded-lg shadow hover:shadow-md transition"
                  >
                    <div className="flex items-center gap-3">
                      {post.images?.length > 0 && (
                        <img
                          src={`https://10.10.6.15/moha-api/public/${post.images[0]}`}
                          alt={post.title}
                          className="w-12 h-12 object-cover rounded-full border border-gray-200 hover:scale-105 transition transform"
                        />
                      )}
                      <Link
                        to={`/posts/${post.id}`}
                        className="text-gray-800 hover:text-blue-600 font-medium line-clamp-1"
                      >
                        {post.title}
                      </Link>
                    </div>
                    <span className="text-gray-500 text-sm">
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 text-center">
              <Link
                to="/announcments"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-full transition"
              >
                View More
              </Link>
            </div>
          </div>

          {/* Videos */}
          <div className="flex flex-col justify-between h-full">
            <div>
              <h3
                className="text-3xl font-extrabold animate-gradient 
                bg-gradient-to-r from-blue-500 via-yellow-400 to-green-500 bg-[length:200%_200%] drop-shadow-lg
                bg-clip-text text-transparent py-3 mb-5 text-center"
              >
                ဗွီဒီယိုမှတ်တမ်းများ
              </h3>

              <div className="flex flex-col gap-6">
                {videos.slice(0, 2).map((post, idx) => {
                  const videoUrl = extractVideoUrl(post.fulltext);
                  const thumb = getYoutubeThumbnail(videoUrl);

                  return (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: idx * 0.1 }}
                      className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer group"
                      onClick={() => setActiveVideo(videoUrl)}
                    >
                      {/* Thumbnail + Play overlay */}
                      <div className="relative w-full h-64 sm:h-56 md:h-72">
                        {thumb && (
                          <img
                            src={thumb}
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                        )}
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
                      <h3 className="px-4 py-3 text-center font-semibold text-lg text-gray-900 line-clamp-2 group-hover:text-blue-600 transition">
                        {post.title}
                      </h3>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link
                to="/videos"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-full transition"
              >
                View More
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
          onClick={(e) => e.target === e.currentTarget && setActiveVideo(null)}
        >
          <div className="w-full max-w-3xl mx-4 relative">
            <button
              className="absolute top-2 right-2 text-white text-2xl font-bold z-10"
              onClick={() => setActiveVideo(null)}
            >
              &times;
            </button>
            <div className="w-full aspect-video">
              <iframe
                src={activeVideo.replace("watch?v=", "embed/")}
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
    </section>
  );
}
