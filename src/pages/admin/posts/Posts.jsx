import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../../api/axios";
import Sidebar from "../../../components/Sidebar";

export default function Posts() {
  const navigate = useNavigate();
  const location = useLocation();

  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("success");

  //Search and filter
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");

  useEffect(() => {
  async function fetchCategories() {
    try {
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to load categories", err);
    }
  }
  fetchCategories();
}, []);


  const fetchPosts = async (pageNum = 1) => {
  const res = await api.get(`/posts`, {
    params: {
      page: pageNum,
      search: search || undefined,
      category_id: categoryId || undefined,
    },
  });
  setPosts(res.data.data);
  setLastPage(res.data.last_page);
};


useEffect(() => {
  fetchPosts(page);
}, [page, search, categoryId]);

  // handle query message
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const msg = params.get("message");
    const type = params.get("type") || "success";
    if (msg) {
      setMessage(msg);
      setMessageType(type);
      setTimeout(() => setMessage(null), 3000);
    }
  }, [location.search]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await api.delete(`/v1/posts/${id}`);
      fetchPosts(page);
    } catch (err) {
      setMessage("Delete failed");
      setMessageType("error");
    }
  };

  const truncateText = (text, max) => {
    return text.length > max ? text.slice(0, max) + "..." : text;
  };

  // pagination: active page +/- 3
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
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100 min-h-screen">
        {message && (
          <div
            className={`mb-4 p-2 rounded text-white ${
              messageType === "success" ? "bg-green-600" : "bg-red-600"
            }`}
          >
            {message}
          </div>
        )}
  <div className="flex gap-2 mb-4"> 
  {/* Search box */}
  <input
    type="text"
    placeholder="Search posts..."
    value={search}
    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
    className="border p-2 rounded"
  />

  {/* Category filter */} 
  <select
    value={categoryId}
    onChange={(e) => { setCategoryId(e.target.value); setPage(1); }}
    className="border p-2 rounded"
  >
    <option value="">All Categories</option>
    {categories.map((c) => (
      <option key={c.id} value={c.id}>{c.title}</option>
    ))}
  </select>
  </div>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Manage Posts</h2>
          <button
            onClick={() => navigate("/admini/posts/create")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Create Post
          </button>
        </div>

        <table className="min-w-full bg-white shadow rounded-lg">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-2">ID</th>
              <th className="p-2">Title</th>
              <th className="p-2">Image</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p.id} className="border-b hover:bg-gray-50 transition">
                <td className="p-2">{p.id}</td>
                <td className="p-2">{truncateText(p.title, 150)}</td>
                <td className="p-2">
                  {p.images && p.images.length > 0 ? (
                    <img
                      src={`https://10.10.6.15/moha-api/public/${p.images[0]}`}
                      alt={p.title}
                      className="w-[75px] h-[75px] object-cover rounded"
                    />
                  ) : (
                    <span className="text-gray-400 italic">No Image</span>
                  )}
                </td>
                <td className="p-2 space-x-2">
                  <button
                    onClick={() => navigate(`/admini/posts/edit/${p.id}`)}
                    className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td
                  colSpan="4"
                  className="p-4 text-center text-gray-500 italic"
                >
                  No posts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

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
    </div>
  );
}
