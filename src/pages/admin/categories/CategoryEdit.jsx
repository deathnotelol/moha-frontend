// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import api from "../../../api/axios";
// import Sidebar from "../../../components/Sidebar";

// export default function CategoryEdit() {
//   const { id } = useParams();
//   const [title, setTitle] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     api.get(`/v1/categories/${id}`).then((res) => setTitle(res.data.title));
//   }, [id]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     await api.put(`/categories/${id}`, { title });
//     navigate("/admini/categories?message=Category updated&type=success");
//   };

//   return (
//     <div className="flex">
//       <Sidebar />
//       <div className="flex-1 p-6 bg-gray-100 min-h-screen">
//         <h1 className="text-2xl font-bold mb-4">Edit Category</h1>
//         <form
//           onSubmit={handleSubmit}
//           className="space-y-4 bg-white p-6 rounded-lg shadow"
//         >
//           <input
//             type="text"
//             placeholder="Category Title"
//             className="w-full border p-2 rounded"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             required
//           />
//           <div className="flex gap-3">
//             <button
//               type="submit"
//               className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//             >
//               Update
//             </button>
//             <button
//               type="button"
//               onClick={() => navigate("/admini/categories")}
//               className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
//             >
//               Back
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../api/axios";
import Sidebar from "../../../components/Sidebar";

export default function CategoryEdit() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [lang, setLang] = useState("mm"); // default language Myanmar
  const navigate = useNavigate();

  // Load existing category data by selected language
  const fetchCategory = async () => {
    const url = lang === "mm"
      ? `/v1/categories/${id}`
      : `/en/v1/categories/${id}`;

    const res = await api.get(url);
    setTitle(res.data.title || "");
  };

  useEffect(() => {
    fetchCategory();
  }, [lang]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = lang === "mm"
      ? `/v1/categories/${id}`
      : `/en/v1/categories/${id}`;

    await api.put(url, { title });

    navigate(
      `/admini/categories?message=Category (${lang.toUpperCase()}) updated&type=success`
    );
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-6 bg-gray-100 min-h-screen">
        <h1 className="text-2xl font-bold mb-4">
          Edit Category ({lang.toUpperCase()})
        </h1>

        {/* Language Switch */}
        <div className="flex gap-3 mb-4">
          <button
            onClick={() => setLang("mm")}
            className={`px-4 py-2 rounded ${
              lang === "mm"
                ? "bg-blue-600 text-white"
                : "bg-gray-300 text-gray-900"
            }`}
          >
            Myanmar
          </button>

          <button
            onClick={() => setLang("en")}
            className={`px-4 py-2 rounded ${
              lang === "en"
                ? "bg-blue-600 text-white"
                : "bg-gray-300 text-gray-900"
            }`}
          >
            English
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-white p-6 rounded-lg shadow"
        >
          <input
            type="text"
            placeholder={`Category Title (${lang.toUpperCase()})`}
            className="w-full border p-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Update ({lang.toUpperCase()})
            </button>

            <button
              type="button"
              onClick={() => navigate("/admini/categories")}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
