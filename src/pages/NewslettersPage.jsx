import React, { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function NewslettersPage() {
  const [newsletters, setNewsletters] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 6;

  const fetchNewsletters = async () => {
    try {
      const res = await api.get("/posts?category_id=6&limit=100"); // fetch all
      setNewsletters(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewsletters();
  }, []);

  const totalPages = Math.ceil(newsletters.length / perPage);

  const currentNewsletters = newsletters.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <main className="flex-1 mt-24 w-full">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h1 className="text-3xl font-extrabold animate-gradient 
                bg-gradient-to-r from-blue-500 via-yellow-400 to-green-500 bg-[length:200%_200%] drop-shadow-lg
                bg-clip-text text-transparent py-3 mb-5 text-center">
            ပြည်ထဲရေးသတင်းလွှာ
          </h1>

          {loading ? (
            <p className="text-center text-gray-500 py-20">Loading...</p>
          ) : newsletters.length === 0 ? (
            <p className="text-center text-gray-500 py-20">No newsletters found.</p>
          ) : (
            <>
              <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentNewsletters.map((post, idx) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition p-6 flex flex-col justify-between"
                  >
                    {/* Circular decorative icon */}
                    <div className="w-16 h-16 flex items-center justify-center rounded-full mb-3 overflow-hidden bg-gradient-to-br from-blue-400 to-blue-200 shadow-lg mx-auto">
                      <img
                        src={`${process.env.PUBLIC_URL}/images/newsletter-icon.png`}
                        alt="Newsletter Icon"
                        className="w-10 h-10 object-contain"
                      />
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-semibold text-gray-800 text-center line-clamp-2 mb-2">
                      {post.title}
                    </h2>

                    {/* Date */}
                    <p className="text-gray-500 text-sm mb-4 text-center">
                      {new Date(post.created_at).toLocaleDateString()}
                    </p>

                    {/* Read More */}
                    <div className="text-center mt-auto">
                      <Link
                        to={`/posts/${post.id}`}
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-full transition shadow-md hover:shadow-lg"
                      >
                        Read More
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center items-center mt-12 space-x-2">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                >
                  Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => goToPage(i + 1)}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === i + 1
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
