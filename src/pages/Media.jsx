import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Media = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const navigate = useNavigate();

  // fetch posts with pagination
  const fetchPosts = async (pageNum = 1) => {
    try {
      const response = await api.get(`/posts?page=${pageNum}`);
      setPosts(response.data.data);
      setLastPage(response.data.last_page);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  // truncate text
  const truncateText = (text, max) => {
    return text?.length > max ? text.slice(0, max) + "..." : text;
  };

  // strip <img> tags from HTML
  const stripImages = (html) => {
    if (!html) return "";
    return html.replace(/<img[^>]*>/gi, "");
  };

  // format date: 13-02-2018
  const formatDate = (dateString) => {
    const d = new Date(dateString);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // generate page numbers (active page +/- 3)
  const getPageNumbers = () => {
    const delta = 3;
    let start = Math.max(1, page - delta);
    let end = Math.min(lastPage, page + delta);
    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto p-6 mt-5">
        <h1 className="text-3xl font-bold mb-8 text-center">Public Posts</h1>
        {posts.length === 0 && (
          <p className="text-center">No posts available</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => {
            const images = Array.isArray(post.images) ? post.images : [];
            return (
              <div
                key={post.id}
                className="bg-white rounded-2xl shadow hover:shadow-lg transition cursor-pointer overflow-hidden"
                onClick={() => navigate(`/posts/${post.id}`)}
              >
                {images.length > 0 && (
                  <img
                    src={`https://10.10.6.15/moha-api/public/${images[0]}`}
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
                      __html: stripImages(truncateText(post.fulltext, 200)),
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

export default Media;
