import { useEffect, useState } from "react";
import api from "../api/axios";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Features() {
  const [announcements, setAnnouncements] = useState([]);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetchPostsByCategory("announcements");
    fetchPostsByCategory("videos");
  }, []);

  const fetchPostsByCategory = async (categoryAlias) => {
    try {
      const res = await api.get(`/posts?category=${categoryAlias}&limit=4`);
      if (categoryAlias === "announcements") setAnnouncements(res.data.data || []);
      if (categoryAlias === "videos") {
        const allVideos = res.data.data || [];
        setVideos(allVideos.slice(0, 4));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-2xl font-bold mb-10 text-center">Our Work</h2>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Announcements - List Style with Circle Thumbnail */}
          <div className="flex flex-col justify-between h-full">
            <div>
              <h3 className="text-xl font-semibold mb-6">ထုတ်ပြန်ကြေငြာချက်များ</h3>
              <ul className="space-y-4">
                {announcements.map((post) => (
                  <li
                    key={post.id}
                    className="flex items-center justify-between bg-white p-3 rounded-lg shadow hover:shadow-md transition"
                  >
                    <div className="flex items-center gap-3">
                      {post.images && post.images.length > 0 && (
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
            {/* View More Button */}
            <div className="mt-4 text-center">
              <Link
                to="/media?category=announcements"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-full transition"
              >
                View More
              </Link>
            </div>
          </div>

          {/* Videos - Card Style with Hover Overlay */}
          <div className="flex flex-col justify-between h-full">
            <div>
              <h3 className="text-xl font-semibold mb-6">ဗွီဒီယိုမှတ်တမ်းများ</h3>
              <div className="grid gap-6 sm:grid-cols-2">
                {videos.map((post, idx) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                    className="bg-white rounded-xl shadow-md overflow-hidden relative group"
                  >
                    {post.images && post.images.length > 0 && (
                      <div className="overflow-hidden relative">
                        <img
                          src={`https://10.10.6.15/moha-api/public/${post.images[0]}`}
                          alt={post.title}
                          className="w-full h-48 object-cover transform group-hover:scale-105 transition duration-500"
                        />
                        {/* Dark overlay + Play Button */}
                        <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                          <div className="w-14 h-14 bg-black bg-opacity-60 rounded-full flex items-center justify-center text-white text-2xl">
                            ▶
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="font-semibold text-lg mb-2 text-gray-900 line-clamp-2 group-hover:text-blue-600 transition">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-3">
                        {post.introtext?.replace(/<[^>]+>/g, "")}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            {/* View More Button */}
            <div className="mt-6 text-center">
              <Link
                to="/media?category=videos"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-full transition"
              >
                View More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
