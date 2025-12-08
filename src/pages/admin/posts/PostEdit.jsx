/* global tinymce */
// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import api from "../../../api/axios";
// import { Editor } from "@tinymce/tinymce-react";
// import Select from "react-select";
// import Sidebar from "../../../components/Sidebar";

// export default function PostEdit() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   // ===== Locale State =====
//   const [locale, setLocale] = useState("mm"); // default Myanmar

//   // ===== Form State =====
//   const [title, setTitle] = useState("");
//   const [introtext, setIntrotext] = useState("");
//   const [fulltext, setFulltext] = useState("");
//   const [category, setCategory] = useState(null);
//   const [categories, setCategories] = useState([]);

//   const [existingImages, setExistingImages] = useState([]);
//   const [newImages, setNewImages] = useState([]);

//   // ===== Fetch categories by locale =====
//   useEffect(() => {
//     const url = locale === "en" ? "/en/categories" : "/categories";
//     api.get(url)
//       .then(res => {
//         const options = res.data.map(c => ({ value: c.id, label: c.title }));
//         setCategories(options);
//         setCategory(null); // reset category when locale changes
//       })
//       .catch(err => console.error("Failed to load categories", err));
//   }, [locale]);

//   // ===== Fetch post data =====
//   useEffect(() => {
//     const url = locale === "en" ? `/en/v1/posts/${id}` : `/v1/posts/${id}`;
//     api.get(url)
//       .then(res => {
//         const data = res.data;
//         setTitle(data.title || "");
//         setIntrotext(data.introtext || "");
//         setFulltext(data.fulltext || "");
//         if (data.category) {
//           setCategory({ value: data.category.id, label: data.category.title });
//         }
//         const imagesArray = Array.isArray(data.images) ? data.images : [];
//         setExistingImages(imagesArray);
//       })
//       .catch(err => console.error("Failed to fetch post", err));
//   }, [id, locale]);

//   // ===== File Picker for TinyMCE =====
//   const filePickerCallback = (callback, value, meta) => {
//     const x = window.innerWidth * 0.8;
//     const y = window.innerHeight * 0.8;
//     const token = localStorage.getItem("token");
//     const cmsURL = `${process.env.REACT_APP_LFM_URL}/moha-api/laravel-filemanager?editor=${meta.fieldname}&type=${meta.filetype}&token=${token}`;

//     tinymce.activeEditor.windowManager.openUrl({
//       url: cmsURL,
//       title: "File Manager",
//       width: x,
//       height: y,
//       resizable: "yes",
//       close_previous: "no",
//       onMessage: (api, message) => {
//         if (message.mceAction === "fileSelected") {
//           callback(message.content);
//           api.close();
//         }
//       },
//     });
//   };

//   // ===== Handle new image uploads =====
//   const handleFileChange = (e) => {
//     const files = Array.from(e.target.files);
//     setNewImages(prev => [...prev, ...files]);
//   };
//   const removeExistingImage = (index) => {
//     setExistingImages(prev => prev.filter((_, i) => i !== index));
//   };
//   const removeNewImage = (index) => {
//     setNewImages(prev => prev.filter((_, i) => i !== index));
//   };

//   // ===== Process fulltext (remove <img>) =====
//   const handleEditorChange = (content) => {
//     let cleaned = content.replace(/<img[^>]*>/gi, "");
//     cleaned = cleaned.replace(/<div[^>]*text-align\s*:\s*center[^>]*>[\s\S]*?<\/div>/gi, "");
//     setFulltext(cleaned);
//   };

//   // ===== Submit =====
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const formData = new FormData();
//       formData.append("title", title);
//       formData.append("introtext", introtext);
//       formData.append("fulltext", fulltext);
//       if (category) formData.append("catid", category.value);
//       existingImages.forEach((img, idx) => formData.append(`existing_images[${idx}]`, img));
//       newImages.forEach((file, idx) => formData.append(`images[${idx}]`, file));

//       const url = locale === "en" ? `/en/v1/posts/${id}?_method=PUT` : `/v1/posts/${id}?_method=PUT`;
//       await api.post(url, formData, { headers: { "Content-Type": "multipart/form-data" } });

//       navigate("/admini/posts?message=Post updated successfully!&type=success");
//     } catch (err) {
//       alert("Failed to update post: " + (err.response?.data?.message || err.message));
//     }
//   };

//   return (
//     <div className="flex">
//       <Sidebar />
//       <div className="flex-1 p-6 bg-gray-100 min-h-screen">
//         <h1 className="text-2xl font-bold mb-4">Edit Post</h1>

//         {/* ===== Locale Toggle ===== */}
//         <div className="flex gap-2 mb-4">
//           <button
//             type="button"
//             className={`px-4 py-2 rounded ${locale === "mm" ? "bg-blue-600 text-white" : "bg-gray-300"}`}
//             onClick={() => setLocale("mm")}
//           >
//             MM
//           </button>
//           <button
//             type="button"
//             className={`px-4 py-2 rounded ${locale === "en" ? "bg-blue-600 text-white" : "bg-gray-300"}`}
//             onClick={() => setLocale("en")}
//           >
//             EN
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
//           <input
//             type="text"
//             placeholder="Title"
//             className="w-full border p-2 rounded"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             required
//           />
//           <textarea
//             placeholder="Intro text"
//             className="w-full border p-2 rounded"
//             value={introtext}
//             onChange={(e) => setIntrotext(e.target.value)}
//           />
//           <div>
//             <label className="block mb-1 font-medium">Full Text</label>
//             <Editor
//               apiKey="clt4eglgtx991vgng3hq7w2d8l3wmlry4h1dack3wvgqars6"
//               value={fulltext}
//               init={{
//                 height: 400,
//                 menubar: true,
//                 plugins: [
//                   "advlist","autolink","lists","link","image","charmap","preview",
//                   "anchor","searchreplace","visualblocks","code","fullscreen",
//                   "insertdatetime","media","table","help","wordcount"
//                 ],
//                 toolbar:
//                   "undo redo | formatselect | bold italic underline strikethrough | " +
//                   "alignleft aligncenter alignright alignjustify | " +
//                   "bullist numlist outdent indent | link image media | " +
//                   "forecolor backcolor removeformat | code fullscreen",
//                 file_picker_callback: filePickerCallback,
//                 content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
//               }}
//               onEditorChange={handleEditorChange}
//             />
//           </div>

//           <div>
//             <label className="block mb-1 font-medium">Category</label>
//             <Select
//               options={categories}
//               value={category}
//               onChange={setCategory}
//               placeholder="Select Category"
//             />
//           </div>

//           <div>
//             <label className="block mb-1 font-medium">Intro Images</label>
//             <div className="flex gap-2 mb-2 flex-wrap">
//               {existingImages.map((img, idx) => (
//                 <div key={idx} className="relative">
//                   <img
//                     src={`https://10.10.6.15/moha-api/public/${img}`}
//                     alt={`existing-${idx}`}
//                     className="w-[100px] h-[100px] object-cover rounded"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => removeExistingImage(idx)}
//                     className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center"
//                   >
//                     ×
//                   </button>
//                 </div>
//               ))}
//               {newImages.map((file, idx) => (
//                 <div key={idx} className="relative">
//                   <img
//                     src={URL.createObjectURL(file)}
//                     alt={`new-${idx}`}
//                     className="w-[100px] h-[100px] object-cover rounded"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => removeNewImage(idx)}
//                     className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center"
//                   >
//                     ×
//                   </button>
//                 </div>
//               ))}
//             </div>
//             <input
//               type="file"
//               multiple
//               onChange={handleFileChange}
//               className="border p-2 rounded"
//             />
//           </div>

//           <div className="flex gap-3">
//             <button
//               type="submit"
//               className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow font-medium transition"
//             >
//               ✅ Update Post
//             </button>
//             <button
//               type="button"
//               onClick={() => navigate("/admini/posts")}
//               className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg shadow font-medium transition"
//             >
//               ← Back
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

/* global tinymce */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../api/axios";
import { Editor } from "@tinymce/tinymce-react";
import Select from "react-select";
import Sidebar from "../../../components/Sidebar";

export default function PostEdit() {
  const { id: uuid } = useParams(); // Myanmar post UUID
  const navigate = useNavigate();

  // ===== Locale State =====
  const [locale, setLocale] = useState("mm"); // default Myanmar

  // ===== Form State =====
  const [form, setForm] = useState({
    mm: { title: "", introtext: "", fulltext: "" },
    en: { title: "", introtext: "", fulltext: "" },
    en_id: null, // English post ID
  });

  // ===== Categories =====
  const [category, setCategory] = useState(null);
  const [categories, setCategories] = useState([]);

  // ===== Images =====
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);

  // ===== Fetch categories =====
  useEffect(() => {
    const url = locale === "en" ? "/en/categories" : "/categories";
    api.get(url).then((res) => {
      const options = res.data.map((c) => ({ value: c.id, label: c.title }));
      setCategories(options);

      const existing = options.find((o) => o.value === category?.value);
      setCategory(existing || null);
    });
  }, [locale]);

  // ===== Fetch Myanmar + English posts =====
  // useEffect(() => {
  //   if (!uuid) return;

  //   const fetchPost = async () => {
  //     try {
  //       const url = `/v1/posts/${uuid}`; // always use this
  //       const res = await api.get(url);

  //       const mmData = res.data.mm;
  //       const enData = res.data.en;

  //       // Save EN id for form usage
  //       if (mmData && enData) {
  //         setForm((prev) => ({
  //           ...prev,
  //           en_id: enData.id,
  //         }));
  //       }

  //       // Set form
  //       setForm((prev) => ({
  //         ...prev,
  //         mm: {
  //           title: mmData?.title ?? "",
  //           introtext: mmData?.introtext ?? "",
  //           fulltext: mmData?.fulltext ?? "",
  //         },
  //         en: {
  //           title: enData?.title ?? "",
  //           introtext: enData?.introtext ?? "",
  //           fulltext: enData?.fulltext ?? "",
  //         },
  //       }));

  //       // Category depending on locale
  //       const activeCat = locale === "en" ? enData?.category : mmData?.category;
  //       setCategory(
  //         activeCat ? { value: activeCat.id, label: activeCat.title } : null
  //       );

  //       // Images depending on locale
  //       const images =
  //         locale === "en" ? enData?.all_images ?? [] : mmData?.all_images ?? [];
  //       setExistingImages(images);
  //       setNewImages([]);
  //     } catch (err) {
  //       console.error("Failed to fetch post", err);
  //     }
  //   };

  //   fetchPost();
  // }, [uuid, locale]);

  // ===== Fetch post once =====
  useEffect(() => {
    if (!uuid) return;

    const fetchPost = async () => {
      try {
        const res = await api.get(`/v1/posts/${uuid}`);
        const mmData = res.data.mm;
        const enData = res.data.en;

        // Save EN id for form usage
        setForm({
          mm: {
            title: mmData?.title || "",
            introtext: mmData?.introtext || "",
            fulltext: mmData?.fulltext || "",
          },
          en: {
            title: enData?.title || "",
            introtext: enData?.introtext || "",
            fulltext: enData?.fulltext || "",
          },
          en_id: enData?.id || null,
        });

        // Set initial category
        const activeCat = mmData?.category;
        setCategory(
          activeCat ? { value: activeCat.id, label: activeCat.title } : null
        );

        // Images
        setExistingImages(mmData?.all_images || []);
        setNewImages([]);
      } catch (err) {
        console.error("Failed to fetch post", err);
      }
    };

    fetchPost();
  }, [uuid]);

  // ===== TinyMCE File Picker =====
  const filePickerCallback = (callback, value, meta) => {
    const x = window.innerWidth * 0.8;
    const y = window.innerHeight * 0.8;
    const token = localStorage.getItem("token");
    const cmsURL = `${process.env.REACT_APP_LFM_URL}/moha-api/laravel-filemanager?editor=${meta.fieldname}&type=${meta.filetype}&token=${token}`;

    tinymce.activeEditor.windowManager.openUrl({
      url: cmsURL,
      title: "File Manager",
      width: x,
      height: y,
      resizable: "yes",
      close_previous: "no",
      onMessage: (api, message) => {
        if (message.mceAction === "fileSelected") {
          callback(message.content);
          api.close();
        }
      },
    });
  };

  // ===== Handle Images =====
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages((prev) => [...prev, ...files]);
  };
  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };
  const removeNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  // ===== Handle form change =====
  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [locale]: { ...prev[locale], [field]: value },
    }));
  };

  // ===== Submit / Update =====
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      // ===== Myanmar =====
      formData.append("title_mm", form.mm.title);
      formData.append("introtext_mm", form.mm.introtext);
      formData.append("fulltext_mm", form.mm.fulltext);

      // ===== English =====
      formData.append("title_en", form.en.title);
      formData.append("introtext_en", form.en.introtext);
      formData.append("fulltext_en", form.en.fulltext);

      // ===== Category =====
      if (category) formData.append("catid", category.value);

      // ===== Existing Images (already uploaded) =====
      existingImages.forEach((img, idx) =>
        formData.append(`existing_images[${idx}]`, img)
      );

      // ===== New Images =====
      newImages.forEach((file, idx) => formData.append(`images[${idx}]`, file));

      // ===== API Call =====
      // Use the same endpoint as store, but with PUT method override
      await api.post(`/v1/posts/${uuid}?_method=PUT`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate("/admini/posts?message=Post updated successfully!&type=success");
    } catch (err) {
      console.error("Failed to update post", err);
      alert(
        "Failed to update post: " + (err.response?.data?.message || err.message)
      );
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100 min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Edit Post</h1>

        {/* Locale Toggle */}
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            className={`px-4 py-2 rounded ${
              locale === "mm" ? "bg-blue-600 text-white" : "bg-gray-300"
            }`}
            onClick={() => setLocale("mm")}
          >
            MM
          </button>
          <button
            type="button"
            className={`px-4 py-2 rounded ${
              locale === "en" ? "bg-blue-600 text-white" : "bg-gray-300"
            }`}
            onClick={() => setLocale("en")}
          >
            EN
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-white p-6 rounded-lg shadow"
        >
          <input
            type="text"
            placeholder="Title"
            className="w-full border p-2 rounded"
            value={form[locale].title}
            onChange={(e) => handleChange("title", e.target.value)}
            required
          />
          <textarea
            placeholder="Intro text"
            className="w-full border p-2 rounded"
            value={form[locale].introtext}
            onChange={(e) => handleChange("introtext", e.target.value)}
          />
          <div>
            <label className="block mb-1 font-medium">Full Text</label>
            <Editor
              apiKey="clt4eglgtx991vgng3hq7w2d8l3wmlry4h1dack3wvgqars6"
              value={form[locale].fulltext}
              init={{
                height: 400,
                menubar: true,
                plugins: [
                  "advlist",
                  "autolink",
                  "lists",
                  "link",
                  "image",
                  "charmap",
                  "preview",
                  "anchor",
                  "searchreplace",
                  "visualblocks",
                  "code",
                  "fullscreen",
                  "insertdatetime",
                  "media",
                  "table",
                  "help",
                  "wordcount",
                ],
                toolbar:
                  "undo redo | formatselect | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image media | forecolor backcolor removeformat | code fullscreen",
                file_picker_callback: filePickerCallback,
                content_style:
                  "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
              }}
              onEditorChange={(content) => handleChange("fulltext", content)}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Category</label>
            <Select
              options={categories}
              value={category}
              onChange={setCategory}
              placeholder="Select Category"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Intro Images</label>
            <div className="flex gap-2 mb-2 flex-wrap">
              {existingImages.map((img, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={
                      img.startsWith("http")
                        ? img
                        : `${process.env.REACT_APP_API_URL}/public/${img}`
                    }
                    alt={`existing-${idx}`}
                    className="w-[100px] h-[100px] object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(idx)}
                    className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
              {newImages.map((file, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`new-${idx}`}
                    className="w-[100px] h-[100px] object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeNewImage(idx)}
                    className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="border p-2 rounded"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow font-medium transition"
            >
              ✅ Update Post
            </button>
            <button
              type="button"
              onClick={() => navigate("/admini/posts")}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg shadow font-medium transition"
            >
              ← Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
