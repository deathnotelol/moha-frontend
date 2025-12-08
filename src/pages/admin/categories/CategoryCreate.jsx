// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../../../api/axios";
// import Sidebar from "../../../components/Sidebar";

// export default function CategoryCreate() {
//   const [title, setTitle] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     await api.post("/v1/categories", { title });
//     navigate("/admini/categories?message=Category created&type=success");
//   };

//   return (
//     <div className="flex">
//       <Sidebar />
//       <div className="flex-1 p-6 bg-gray-100 min-h-screen">
//         <h1 className="text-2xl font-bold mb-4">Create Category</h1>
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
//               className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
//             >
//               Save
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

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import Sidebar from "../../../components/Sidebar";

export default function CategoryCreate() {
  const [title, setTitle] = useState("");
  const [lang, setLang] = useState("mm"); // default is Myanmar
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // API endpoint by language
    const url = lang === "mm"
      ? "/v1/categories"           // Myanmar
      : "/en/v1/categories";       // English

    await api.post(url, { title });

    navigate(
      `/admini/categories?message=Category (${lang.toUpperCase()}) created&type=success`
    );
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-6 bg-gray-100 min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Create Category</h1>

        {/* Language Switch Buttons */}
        <div className="flex gap-3 mb-4">
          <button
            onClick={() => setLang("mm")}
            className={`px-4 py-2 rounded ${
              lang === "mm"
                ? "bg-blue-600 text-white"
                : "bg-gray-300 text-gray-800"
            }`}
          >
            Myanmar
          </button>

          <button
            onClick={() => setLang("en")}
            className={`px-4 py-2 rounded ${
              lang === "en"
                ? "bg-blue-600 text-white"
                : "bg-gray-300 text-gray-800"
            }`}
          >
            English
          </button>
        </div>

        {/* Category Form */}
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
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Save ({lang.toUpperCase()})
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

