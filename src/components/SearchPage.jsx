import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("q") || "";
  const [results, setResults] = useState([]);
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    if (keyword) {
      fetchResults(page);
    }
  }, [keyword, page]);

  const fetchResults = async (page) => {
    try {
      const response = await api.get(`/posts?search=${keyword}&page=${page}`);
      setResults(response.data.data);
      setPagination({
        currentPage: response.data.current_page,
        lastPage: response.data.last_page,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const truncateText = (text, max) => {
    return text?.length > max ? text.slice(0, max) + "..." : text;
  };

  // strip <img> tags from HTML
  const stripImages = (html) => {
    if (!html) return "";
    return html.replace(/<img[^>]*>/gi, "");
  };

  // ✅ Highlight keyword
  const highlightText = (text, keyword) => {
    if (!keyword) return text;
    const regex = new RegExp(`(${keyword})`, "gi");
    return text.split(regex).map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="bg-yellow-300 font-bold px-1 rounded">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  // ✅ Circle Pagination
  const renderPagination = () => {
    if (!pagination.lastPage) return null;

    let pages = [];
    let start = Math.max(1, pagination.currentPage - 4);
    let end = Math.min(pagination.lastPage, pagination.currentPage + 4);

    for (let i = start; i <= end; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setPage(i)}
          className={`w-10 h-10 flex items-center justify-center rounded-full border transition ${
            pagination.currentPage === i
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-700 border-gray-300 hover:bg-blue-100"
          }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex flex-col items-center mt-8 space-y-6">
        {/* Pagination buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setPage(1)}
            disabled={pagination.currentPage === 1}
            className="w-10 h-10 flex items-center justify-center rounded-full border bg-white text-gray-600 hover:bg-blue-100 disabled:opacity-50"
          >
            Start
          </button>
          <button
            onClick={() => setPage(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className="w-10 h-10 flex items-center justify-center rounded-full border bg-white text-gray-600 hover:bg-blue-100 disabled:opacity-50"
          >
            Prev
          </button>

          {pages}

          <button
            onClick={() => setPage(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.lastPage}
            className="w-10 h-10 flex items-center justify-center rounded-full border bg-white text-gray-600 hover:bg-blue-100 disabled:opacity-50"
          >
            Next
          </button>
          <button
            onClick={() => setPage(pagination.lastPage)}
            disabled={pagination.currentPage === pagination.lastPage}
            className="w-10 h-10 flex items-center justify-center rounded-full border bg-white text-gray-600 hover:bg-blue-100 disabled:opacity-50"
          >
            End
          </button>
        </div>

        {/* Back to Home */}
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition"
        >
          ⬅ Back to Home
        </button>
      </div>
    );
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <h2 className="text-3xl font-bold text-center mb-8">
        Search Results for <span className="text-blue-600">"{keyword}"</span>
      </h2>

      {/* Results Grid */}

      {/* src={`https://10.10.6.15/moha-api/public/${post.all_images[0]}`} */}

      {results.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition p-4 flex flex-col cursor-pointer"
                onClick={() => navigate(`/posts/${post.id}`)}
              >
                {post.all_images?.length > 0 && (
                  <img
                    src={`https://10.10.6.15/moha-api/public/${post.all_images[0]}`}
                    alt={post.title}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                )}
                <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                  {highlightText(post.title, keyword)}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-3" 
                  dangerouslySetInnerHTML={{
                      __html: stripImages(truncateText(post.fulltext, 200)),
                    }}>
                </p>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {renderPagination()}
        </>
      ) : (
        <p className="text-center text-gray-500">No results found.</p>
      )}
    </div>
  );
}
