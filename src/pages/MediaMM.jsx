import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MediaMM = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const navigate = useNavigate();

  // Load posts
  const fetchPosts = async (pageNum = 1) => {
    try {
      const res = await api.get(`/posts?page=${pageNum}&category_id=1`);
      setPosts(res.data.data || []);
      setLastPage(res.data.last_page || 1);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  // Helpers
  const truncateText = (text, max) =>
    text?.length > max ? text.slice(0, max) + "..." : text;

  const stripImages = (html) =>
    html ? html.replace(/<img[^>]*>/gi, "") : "";

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return `${String(d.getDate()).padStart(2, "0")}-${String(
      d.getMonth() + 1
    ).padStart(2, "0")}-${d.getFullYear()}`;
  };

  const getPageNumbers = () => {
    const delta = 3;
    const start = Math.max(1, page - delta);
    const end = Math.min(lastPage, page + delta);
    return [...Array(end - start + 1)].map((_, i) => start + i);
  };

  const pageNumbers = getPageNumbers();

  return (
    <div>
      <Navbar />

      <div className="max-w-7xl mx-auto p-6 mt-5">
        <h2
          className="text-4xl font-extrabold animate-gradient 
          bg-gradient-to-r from-blue-500 via-yellow-400 to-green-500 bg-[length:200%_200%] drop-shadow-lg
          bg-clip-text text-transparent py-3 my-16 text-center"
        >
          ဝန်ကြီးဌာနသတင်းများ
        </h2>

        {posts.length === 0 && (
          <p className="text-center">No posts available</p>
        )}

        {/* POSTS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => {
            const images = Array.isArray(post.images) ? post.images : [];

            return (
              <div
                key={post.id}
                className="bg-white rounded-2xl shadow hover:shadow-lg transition cursor-pointer overflow-hidden"
                onClick={() => navigate(`/mm/posts/${post.uuid}`)}
              >
                {images.length > 0 && (
                  <img
                    src={`https://192.168.110.15/moha-api/public/${images[0]}`}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                )}

                <div className="p-4">
                  <h2 className="text-xl font-bold mb-6">{post.title}</h2>

                  <h3 className="text-sm text-blue-700 font-bold mb-3">
                    Created at: {formatDate(post.published_at)}
                  </h3>

                  <p
                    className="text-gray-600"
                    dangerouslySetInnerHTML={{
                      __html: stripImages(
                        truncateText(post.fulltext, 200)
                      ),
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
          <button
            disabled={page === 1}
            onClick={() => setPage(1)}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Start
          </button>

          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>

          {pageNumbers.map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`px-3 py-1 rounded ${
                p === page ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              {p}
            </button>
          ))}

          <button
            disabled={page === lastPage}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>

          <button
            disabled={page === lastPage}
            onClick={() => setPage(lastPage)}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            End
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MediaMM;
