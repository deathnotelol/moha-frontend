// import React, { useEffect, useState } from "react";
// import api from "../../api/axios";
// import Sidebar from "../../components/Sidebar";

// function flattenTree(tree) {
//   const rows = [];
//   function rec(nodes, parent = null, level = 1) {
//     nodes.forEach((n, idx) => {
//       rows.push({
//         id: n.id,
//         title: n.title,
//         url: n.url,
//         parent_id: parent,
//         order: n.order ?? idx,
//         active: !!n.active,
//         post_uuid: n.post_uuid ?? null,
//         post_title: n.post_title ?? null,
//         level,
//       });
//       if (n.children && n.children.length) rec(n.children, n.id, level + 1);
//     });
//   }
//   rec(tree);
//   return rows;
// }

// export default function ManageMenus() {
//   const [locale, setLocale] = useState("mm");
//   const [tree, setTree] = useState([]);
//   const [rows, setRows] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // posts
//   const [posts, setPosts] = useState([]);
//   const [search, setSearch] = useState("");
//   const [page, setPage] = useState(1);
//   const [lastPage, setLastPage] = useState(1);
//   const [categories, setCategories] = useState([]);
//   const [categoryId, setCategoryId] = useState("");

//   const [postModalOpen, setPostModalOpen] = useState(false);

//   // Form state
//   const [editingItem, setEditingItem] = useState(null); // null: add new, else edit
//   const [title, setTitle] = useState("");
//   const [url, setUrl] = useState("");
//   const [parentId, setParentId] = useState(null);
//   const [active, setActive] = useState(true);
//   const [postUUID, setPostUUID] = useState(null);
//   const [postTitle, setPostTitle] = useState("");

//   // Add modal state
//   const [modalOpen, setModalOpen] = useState(false);

//   const apiBase = locale === "en" ? "/en" : "";

//   // Fetch menus
//   useEffect(() => {
//     fetchMenus();
//   }, [locale]);

//   async function fetchMenus() {
//     setLoading(true);
//     try {
//       const res = await api.get(`${apiBase}/menus`);
//       setTree(res.data);
//       setRows(flattenTree(res.data));
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   }

//   // Fetch posts
//   async function fetchPosts() {
//     try {
//       const res = await api.get(locale === "en" ? "/en/posts" : "/posts", {
//         params: { page, search, category_id: categoryId || undefined },
//       });
//       setPosts(res.data.data);
//       setLastPage(res.data.last_page);
//     } catch (err) {
//       console.error(err);
//     }
//   }

//   useEffect(() => {
//     if (postModalOpen) fetchPosts();
//   }, [page, search, categoryId, postModalOpen, locale]);

//   // Form handlers
//   function openAdd(parent = null) {
//     setEditingItem(null);
//     resetForm();
//     setParentId(parent);
//     setModalOpen(true); // ✅ modal open
//   }

//   function openEdit(item) {
//     setEditingItem(item);
//     setTitle(item.title);
//     setUrl(item.url || "");
//     setParentId(item.parent_id || null);
//     setActive(item.active);
//     setPostUUID(item.post_uuid || null);
//     setPostTitle(item.post_title || "");
//     setModalOpen(true); // ✅ modal open
//   }

//   function resetForm() {
//     setTitle("");
//     setUrl("");
//     setParentId(null);
//     setActive(true);
//     setPostUUID(null);
//     setPostTitle("");
//   }

//   async function handleSaveNewOrEdit(e) {
//     e.preventDefault();
//     try {
//       const payload = {
//         title,
//         url: url || null,
//         parent_id: parentId,
//         active,
//         post_uuid: postUUID,
//       };
//       if (editingItem) {
//         await api.put(`${apiBase}/menus/${editingItem.id}`, payload);
//       } else {
//         await api.post(`${apiBase}/menus`, payload);
//       }
//       await fetchMenus();
//       closeForm();
//     } catch (err) {
//       console.error("Update failed:", err.response?.data);
//       alert("Error saving");
//     }
//   }

//   // close modal
//   function closeForm() {
//     resetForm();
//     setEditingItem(null);
//     setParentId(null);
//     setModalOpen(false);
//   }

//   async function handleDelete(id) {
//     if (!window.confirm("Are you sure to delete?")) return;
//     try {
//       await api.delete(`${apiBase}/menus/${id}`);
//       fetchMenus();
//     } catch (err) {
//       console.error(err);
//     }
//   }

//   return (
//     <div className="flex">
//       <Sidebar />
//       <div className="flex-1 p-6 bg-gray-100 min-h-screen">
//         <h1 className="text-2xl font-bold mb-4">Manage Menus</h1>
//         {/* Locale & Actions */}
//         <div className="mb-4 flex gap-2">
//           <button
//             onClick={() => setLocale("mm")}
//             className={`px-3 py-2 rounded ${
//               locale === "mm" ? "bg-blue-600 text-white" : "bg-gray-300"
//             }`}
//           >
//             မြန်မာ
//           </button>
//           <button
//             onClick={() => setLocale("en")}
//             className={`px-3 py-2 rounded ${
//               locale === "en" ? "bg-blue-600 text-white" : "bg-gray-300"
//             }`}
//           >
//             English
//           </button>
//           <button
//             onClick={() => openAdd(null)}
//             className="px-4 py-2 bg-blue-600 text-white rounded"
//           >
//             Add New Menu
//           </button>
//         </div>
//         {/* Menu Table */}
//         {loading ? (
//           <p>Loading...</p>
//         ) : (
//           <table className="w-full bg-white shadow rounded">
//             <thead className="bg-gray-200">
//               <tr>
//                 <th className="p-2">Title</th>
//                 <th>URL</th>
//                 <th>Post</th>
//                 <th>Order</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {rows.map((r) => (
//                 <tr key={r.id} className="border-b">
//                   <td className="p-2">
//                     {"— ".repeat(r.level - 1)}
//                     {r.title}
//                   </td>
//                   <td>{r.url}</td>
//                   <td>{r.post_title || "-"}</td>
//                   <td>{r.order}</td>
//                   <td className="flex gap-2 p-2">
//                     <button
//                       onClick={() => openEdit(r)}
//                       className="bg-blue-600 text-white rounded px-4 py-2"
//                     >
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => handleDelete(r.id)}
//                       className="bg-red-600 text-white rounded px-4 py-2"
//                     >
//                       Delete
//                     </button>
//                     <button
//                       onClick={() => openAdd(r.id)}
//                       className="bg-green-600 text-white rounded px-4 py-2"
//                     >
//                       Add Child
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}

//         {modalOpen && (
//           <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
//             <div className="bg-white p-6 rounded shadow-lg w-[600px] max-h-[90vh] overflow-y-auto">
//               <h2 className="text-xl mb-3">
//                 {editingItem ? "Edit Menu" : "Add Menu"}
//               </h2>
//               <form
//                 onSubmit={handleSaveNewOrEdit}
//                 className="flex flex-col gap-3"
//               >
//                 <input
//                   className="border p-2 w-full"
//                   placeholder="Menu title"
//                   value={title}
//                   onChange={(e) => setTitle(e.target.value)}
//                   required
//                 />
//                 <div className="flex gap-2">
//                   <input
//                     className="border p-2 flex-1"
//                     placeholder="URL (optional)"
//                     value={url}
//                     onChange={(e) => setUrl(e.target.value)}
//                   />
//                   <button
//                     type="button"
//                     className="px-3 py-2 bg-gray-300"
//                     onClick={() => setPostModalOpen(true)}
//                   >
//                     Choose Post
//                   </button>
//                 </div>
//                 {postUUID && (
//                   <div className="text-sm bg-green-100 p-2 rounded">
//                     Selected Post: {postTitle}
//                   </div>
//                 )}
//                 <div className="flex justify-end gap-2 mt-4">
//                   <button
//                     type="submit"
//                     className="px-4 py-2 bg-blue-600 text-white rounded"
//                   >
//                     Save
//                   </button>
//                   <button
//                     type="button"
//                     onClick={closeForm}
//                     className="px-4 py-2 border rounded"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}
//         {/* Post Modal */}
//         {postModalOpen && (
//           <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
//             <div className="bg-white p-6 rounded shadow-lg w-[900px] max-h-[90vh] overflow-y-auto">
//               <h3 className="text-xl font-bold mb-4">Select Post</h3>

//               <div className="flex gap-2 mb-3">
//                 <input
//                   type="text"
//                   placeholder="Search..."
//                   className="border p-2 flex-1"
//                   value={search}
//                   onChange={(e) => {
//                     setSearch(e.target.value);
//                     setPage(1);
//                   }}
//                 />
//                 <select
//                   className="border p-2"
//                   value={categoryId}
//                   onChange={(e) => {
//                     setCategoryId(e.target.value);
//                     setPage(1);
//                   }}
//                 >
//                   <option value="">All Categories</option>
//                   {categories.map((c) => (
//                     <option key={c.id} value={c.id}>
//                       {c.title}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <table className="w-full table-auto mb-4">
//                 <thead>
//                   <tr>
//                     <th className="text-left">Title</th>
//                     <th></th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {posts.map((p) => (
//                     <tr key={p.id} className="border-t">
//                       <td className="py-2">{p.title}</td>
//                       <td className="text-right">
//                         <button
//                           className="bg-green-600 text-white px-2 py-1 rounded"
//                           onClick={() => {
//                             setPostUUID(p.uuid);
//                             setPostTitle(p.title);
//                             setPostModalOpen(false);
//                           }}
//                         >
//                           Select
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>

//               <div className="flex justify-between items-center">
//                 <button
//                   disabled={page <= 1}
//                   onClick={() => setPage((p) => p - 1)}
//                   className="px-3 py-1 border rounded disabled:opacity-50"
//                 >
//                   Prev
//                 </button>
//                 <span>
//                   Page {page} / {lastPage}
//                 </span>
//                 <button
//                   disabled={page >= lastPage}
//                   onClick={() => setPage((p) => p + 1)}
//                   className="px-3 py-1 border rounded disabled:opacity-50"
//                 >
//                   Next
//                 </button>
//               </div>

//               <div className="mt-4 text-right">
//                 <button
//                   onClick={() => setPostModalOpen(false)}
//                   className="px-4 py-2 border rounded"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import Sidebar from "../../components/Sidebar";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// Flatten tree for table display
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
        post_uuid: n.post_uuid ?? null,
        post_title: n.post_title ?? null,
        level,
        children: n.children ?? [],
      });
      if (n.children && n.children.length) rec(n.children, n.id, level + 1);
    });
  }
  rec(tree);
  return rows;
}

export default function ManageMenus() {
  const [locale, setLocale] = useState("mm");
  const [tree, setTree] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  // posts
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");

  const [postModalOpen, setPostModalOpen] = useState(false);

  // Form state
  const [editingItem, setEditingItem] = useState(null); // null: add new, else edit
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [parentId, setParentId] = useState(null);
  const [active, setActive] = useState(true);
  const [postUUID, setPostUUID] = useState(null);
  const [postTitle, setPostTitle] = useState("");

  const [modalOpen, setModalOpen] = useState(false);

  const apiBase = locale === "en" ? "/en" : "";

  // Fetch menus
  useEffect(() => {
    fetchMenus();
  }, [locale]);

  async function fetchMenus() {
    setLoading(true);
    try {
      const res = await api.get(`${apiBase}/menus`);
      setTree(res.data);
      setRows(flattenTree(res.data));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // Fetch posts
  async function fetchPosts() {
    try {
      const res = await api.get(locale === "en" ? "/en/posts" : "/posts", {
        params: { page, search, category_id: categoryId || undefined },
      });
      setPosts(res.data.data);
      setLastPage(res.data.last_page);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (postModalOpen) fetchPosts();
  }, [page, search, categoryId, postModalOpen, locale]);

  // Open Add/Edit Modal
  function openAdd(parent = null) {
    setEditingItem(null);
    resetForm();
    setParentId(parent);
    setModalOpen(true);
  }

  function openEdit(item) {
    setEditingItem(item);
    setTitle(item.title);
    setUrl(item.url || "");
    setParentId(item.parent_id || null);
    setActive(item.active);
    setPostUUID(item.post_uuid || null);
    setPostTitle(item.post_title || "");
    setModalOpen(true);
  }

  function resetForm() {
    setTitle("");
    setUrl("");
    setParentId(null);
    setActive(true);
    setPostUUID(null);
    setPostTitle("");
  }

  function closeForm() {
    resetForm();
    setEditingItem(null);
    setParentId(null);
    setModalOpen(false);
  }

  async function handleSaveNewOrEdit(e) {
    e.preventDefault();
    try {
      const payload = {
        title,
        url: url || null,
        parent_id: parentId,
        active,
        post_uuid: postUUID,
      };
      if (editingItem) {
        await api.put(`${apiBase}/menus/${editingItem.id}`, payload);
      } else {
        await api.post(`${apiBase}/menus`, payload);
      }
      await fetchMenus();
      closeForm();
    } catch (err) {
      console.error("Update failed:", err.response?.data);
      alert("Error saving");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure to delete?")) return;
    try {
      await api.delete(`${apiBase}/menus/${id}`);
      fetchMenus();
    } catch (err) {
      console.error(err);
    }
  }

  // Drag & Drop handlers
  function handleDragEnd(result) {
    if (!result.destination) return;
    const { source, destination, type } = result;

    if (type === "PARENT") {
      const updated = Array.from(tree);
      const [removed] = updated.splice(source.index, 1);
      updated.splice(destination.index, 0, removed);
      setTree(updated);
      setRows(flattenTree(updated));
      saveBulkUpdate(updated);
    }

    if (type.startsWith("CHILD")) {
      const parentId = parseInt(type.split("-")[1], 10);
      const parent = tree.find((p) => p.id === parentId);
      const updatedChildren = Array.from(parent.children);
      const [removed] = updatedChildren.splice(source.index, 1);
      updatedChildren.splice(destination.index, 0, removed);

      const updatedTree = tree.map((p) =>
        p.id === parentId ? { ...p, children: updatedChildren } : p
      );
      setTree(updatedTree);
      setRows(flattenTree(updatedTree));
      saveBulkUpdate(updatedTree);
    }
  }

  async function saveBulkUpdate(updatedTree) {
    const items = [];
    function recurse(nodes, parent = null) {
      nodes.forEach((n, idx) => {
        items.push({
          id: n.id,
          parent_id: parent,
          order: idx,
          post_uuid: n.post_uuid ?? null,
        });
        if (n.children && n.children.length) recurse(n.children, n.id);
      });
    }
    recurse(updatedTree);
    try {
      await api.post(`${apiBase}/menus/bulk-update`, { items });
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100 min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Manage Menus</h1>
        <div className="mb-4 flex gap-2 flex-wrap">
          <button
            onClick={() => setLocale("mm")}
            className={`px-3 py-2 rounded ${
              locale === "mm" ? "bg-blue-600 text-white" : "bg-gray-300"
            }`}
          >
            မြန်မာ
          </button>
          <button
            onClick={() => setLocale("en")}
            className={`px-3 py-2 rounded ${
              locale === "en" ? "bg-blue-600 text-white" : "bg-gray-300"
            }`}
          >
            English
          </button>
          <button
            onClick={() => openAdd(null)}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Add New Menu
          </button>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="parents" type="PARENT">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="space-y-2"
              >
                {tree.map((parent, pIndex) => (
                  <Draggable
                    key={parent.id}
                    draggableId={parent.id.toString()}
                    index={pIndex}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="bg-white shadow rounded"
                      >
                        <div
                          className="flex justify-between items-center p-3 border-b"
                          {...provided.dragHandleProps}
                        >
                          <strong>{parent.title}</strong>
                          <div className="flex gap-2">
                            <button
                              onClick={() => openEdit(parent)}
                              className="px-2 py-1 bg-blue-600 text-white rounded text-md"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(parent.id)}
                              className="px-2 py-1 bg-red-600 text-white rounded text-md"
                            >
                              Delete
                            </button>
                            <button
                              onClick={() => openAdd(parent.id)}
                              className="px-2 py-1 bg-green-600 text-white rounded text-md"
                            >
                              Add Child
                            </button>
                          </div>
                        </div>

                        <Droppable
                          droppableId={`children-${parent.id}`}
                          type={`CHILD-${parent.id}`}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className="ml-6 p-1 space-y-1"
                            >
                              {parent.children.map((child, cIndex) => (
                                <Draggable
                                  key={child.id}
                                  draggableId={child.id.toString()}
                                  index={cIndex}
                                >
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className={`p-2 border-l-4 border-blue-300 rounded bg-gray-50 flex justify-between items-center ${
                                        snapshot.isDragging
                                          ? "bg-blue-50"
                                          : "hover:bg-gray-100"
                                      }`}
                                    >
                                      <span className="ml-2">
                                        {child.title}
                                      </span>
                                      <div className="flex gap-1">
                                        <button
                                          onClick={() => openEdit(child)}
                                          className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-500"
                                        >
                                          Edit
                                        </button>
                                        <button
                                          onClick={() => handleDelete(child.id)}
                                          className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-500"
                                        >
                                          Delete
                                        </button>
                                        <button
                                          onClick={() => openAdd(child.id)}
                                          className="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-500"
                                        >
                                          Add Child
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {/* Add/Edit Modal */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-2">
            <div className="bg-white rounded shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto p-4">
              <h2 className="text-xl mb-3">
                {editingItem ? "Edit Menu" : "Add Menu"}
              </h2>
              <form
                className="flex flex-col gap-3"
                onSubmit={handleSaveNewOrEdit}
              >
                <input
                  className="border p-2 w-full"
                  placeholder="Menu title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
                <div className="flex gap-2">
                  <input
                    className="border p-2 flex-1"
                    placeholder="URL (optional)"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                  <button
                    type="button"
                    className="px-3 py-2 bg-gray-300"
                    onClick={() => setPostModalOpen(true)}
                  >
                    Choose Post
                  </button>
                </div>
                {postUUID && (
                  <div className="bg-green-100 p-2 rounded text-sm">
                    Selected Post: {postTitle}
                  </div>
                )}
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={closeForm}
                    className="px-4 py-2 border rounded"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Post Modal */}
        {postModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-2">
            <div className="bg-white rounded shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto p-4">
              <h3 className="text-xl font-bold mb-4">Select Post</h3>
              <div className="flex gap-2 mb-3 flex-wrap">
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
                  className="border p-2"
                  value={categoryId}
                  onChange={(e) => {
                    setCategoryId(e.target.value);
                    setPage(1);
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
                            setPostUUID(p.uuid);
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
              <div className="flex justify-between items-center mb-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Prev
                </button>
                <span>
                  Page {page} / {lastPage}
                </span>
                <button
                  disabled={page >= lastPage}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="text-right">
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
