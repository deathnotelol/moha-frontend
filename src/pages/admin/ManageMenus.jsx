import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import Sidebar from "../../components/Sidebar";

function flattenTree(tree) {
  const rows = [];
  function rec(nodes, parent = null, level = 1) {
    nodes.forEach((n, idx) => {
      rows.push({
        id: n.id,
        title: n.title,
        url: n.url,
        parent_id: parent,
        order: n.order ?? idx,
        active: !!n.active,
        post_id: n.post_id ?? null,
        level,
      });
      if (n.children && n.children.length) rec(n.children, n.id, level + 1);
    });
  }
  rec(tree);
  return rows;
}

export default function ManageMenus() {
  const [tree, setTree] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  // Posts for modal
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  // categories
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");

  // modal state
  const [postModalOpen, setPostModalOpen] = useState(false);

  // form state
  const [editing, setEditing] = useState(null);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [parentId, setParentId] = useState(null);
  const [active, setActive] = useState(true);
  const [postId, setPostId] = useState(null);
  const [postTitle, setPostTitle] = useState("");

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

  useEffect(() => {
    fetchMenus();
  }, []);

  useEffect(() => {
    if (postModalOpen) fetchPosts();
  }, [page, search, categoryId, postModalOpen]);

  async function fetchMenus() {
    setLoading(true);
    try {
      const res = await api.get("/menus");
      setTree(res.data);
      setRows(flattenTree(res.data));
    } finally {
      setLoading(false);
    }
  }

  async function fetchPosts() {
    try {
      const res = await api.get("/posts", {
        params: { page, search, category_id: categoryId || undefined },
      });
      setPosts(res.data.data);
      setLastPage(res.data.last_page);
    } catch (err) {
      console.error(err);
    }
  }

  function openAdd(parent = null) {
    setEditing(null);
    setTitle("");
    setUrl("");
    setParentId(parent);
    setActive(true);
    setPostId(null);
    setPostTitle("");
  }

  function openEdit(item) {
    setEditing(item.id);
    setTitle(item.title);
    setUrl(item.url || "");
    setParentId(item.parent_id || null);
    setActive(item.active);
    setPostId(item.post_id || null);
    setPostTitle(rows.find((r) => r.id === item.id)?.post_title || "");
  }

  async function handleSaveNewOrEdit(e) {
    e.preventDefault();
    try {
      const payload = {
        title,
        url,
        parent_id: parentId,
        active,
        post_id: postId,
      };
      if (editing) {
        await api.put(`/menus/${editing}`, payload);
      } else {
        await api.post("/menus", payload);
      }
      await fetchMenus();
      setEditing(null);
      resetForm();
    } catch (err) {
      console.error(err);
      alert("Error saving menu");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure to delete this menu?")) return;
    try {
      await api.delete(`/menus/${id}`);
      await fetchMenus();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  }

  function resetForm() {
    setTitle("");
    setUrl("");
    setParentId(null);
    setPostId(null);
    setPostTitle("");
  }

  async function handleSaveAll() {
    const items = rows.map((r) => ({
      id: r.id,
      parent_id: r.parent_id ?? null,
      order: r.order ?? 0,
      post_id: r.post_id ?? null,
    }));
    try {
      await api.post("/menus/bulk-update", { items });
      await fetchMenus();
      alert("Saved");
    } catch (err) {
      console.error(err);
      alert("Save failed");
    }
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100 min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Manage Menus</h1>
        <div className="mb-4 flex gap-2">
          <button
            onClick={() => openAdd(null)}
            className="bg-blue-600 text-white px-3 py-2 rounded"
          >
            Add Top Menu
          </button>
          <button
            onClick={handleSaveAll}
            className="bg-green-600 text-white px-3 py-2 rounded"
          >
            Save All
          </button>
          <button
            onClick={fetchMenus}
            className="bg-gray-600 text-white px-3 py-2 rounded"
          >
            Reload
          </button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="bg-white p-4 rounded shadow overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr>
                  <th className="text-left">Title</th>
                  <th>Parent</th>
                  <th>Order</th>
                  <th>Active</th>
                  <th>Post</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-t">
                    <td className="py-2">{r.title}</td>
                    <td className="text-center">{r.parent_id || "-"}</td>
                    <td className="text-center">{r.order}</td>
                    <td className="text-center">{r.active ? "Yes" : "No"}</td>
                    <td className="text-center">
                      {r.post_id
                        ? posts.find((p) => p.id === r.post_id)?.title
                        : "-"}
                    </td>
                    <td className="text-center">
                      <button
                        onClick={() => openAdd(r.id)}
                        className="mr-2 bg-indigo-500 text-white px-2 py-1 rounded"
                      >
                        Add child
                      </button>
                      <button
                        onClick={() => openEdit(r)}
                        className="mr-2 bg-yellow-500 px-2 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(r.id)}
                        className="bg-red-600 text-white px-2 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Form */}
        <div className="mt-6 bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">
            {editing ? "Edit Menu" : "Add Menu"}
          </h2>
          <form
            onSubmit={handleSaveNewOrEdit}
            className="grid grid-cols-2 gap-3"
          >
            <div>
              <label>Title</label>
              <input
                className="border p-2 w-full"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <label>URL</label>
              <input
                className="border p-2 w-full"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="/about"
              />
            </div>
            <div>
              <label>Active</label>
              <select
                className="border p-2 w-full"
                value={active ? "1" : "0"}
                onChange={(e) => setActive(e.target.value === "1")}
              >
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
            </div>
            <div>
              <label>Link Post</label>
              <div className="flex items-center gap-2">
                <input
                  className="border p-2 flex-1"
                  value={postTitle}
                  readOnly
                  placeholder="No post linked"
                />
                <button
                  type="button"
                  onClick={() => setPostModalOpen(true)}
                  className="bg-blue-600 text-white px-3 py-2 rounded"
                >
                  Select
                </button>
              </div>
            </div>
            <div className="col-span-2 flex gap-2 mt-2">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded"
                type="submit"
              >
                {editing ? "Update" : "Create"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditing(null);
                  resetForm();
                }}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Modal for posts */}
        {postModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-[700px] max-h-[80vh] overflow-y-auto">
              <h3 className="text-xl font-bold mb-4">Select Post</h3>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  placeholder="Search..."
                  className="border p-2 flex-1"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                />
                <select
                  className="border p-2 w-full mb-3"
                  value={categoryId}
                  onChange={(e) => {
                    setCategoryId(e.target.value);
                    setPage(1); // filter ပြောင်းတာနဲ့ page ကို 1 သို့ reset
                  }}
                >
                  <option value="">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>
              <table className="w-full table-auto mb-4">
                <thead>
                  <tr>
                    <th className="text-left">Title</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((p) => (
                    <tr key={p.id} className="border-t">
                      <td className="py-2">{p.title}</td>
                      <td className="text-right">
                        <button
                          className="bg-green-600 text-white px-2 py-1 rounded"
                          onClick={() => {
                            setPostId(p.id);
                            setPostTitle(p.title);
                            setPostModalOpen(false);
                          }}
                        >
                          Select
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Pagination */}
              <div className="flex justify-between items-center">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-3 py-1 border rounded"
                >
                  Prev
                </button>
                <span>
                  Page {page} of {lastPage}
                </span>
                <button
                  disabled={page >= lastPage}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-1 border rounded"
                >
                  Next
                </button>
              </div>
              <div className="mt-4 text-right">
                <button
                  onClick={() => setPostModalOpen(false)}
                  className="px-4 py-2 border rounded"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
