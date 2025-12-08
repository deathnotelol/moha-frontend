/* global tinymce */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import { Editor } from "@tinymce/tinymce-react";
import Select from "react-select";
import Sidebar from "../../../components/Sidebar";

export default function PostCreate() {
  const navigate = useNavigate();

  // ====== Locale Toggle ======
  const [locale, setLocale] = useState("mm"); // default MM

  // ====== Form State for MM & EN ======
  const [form, setForm] = useState({
    mm: { title: "", introtext: "", fulltext: "" },
    en: { title: "", introtext: "", fulltext: "" },
  });

  // ====== Categories ======
  const [category, setCategory] = useState(null);
  const [categories, setCategories] = useState([]);

  // ====== Images ======
  const [images, setImages] = useState([]);

  // ====== TinyMCE File Picker ======
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

  // ====== Fetch Categories ======
  useEffect(() => {
    const url = locale === "en" ? "/en/categories" : "/categories";
    api.get(url).then((res) => {
      const options = res.data.map((c) => ({ value: c.id, label: c.title }));
      const existing = options.find((o) => o.value === category?.value);
      setCategories(options);
      if (existing) setCategory(existing);
      else setCategory(null);
    });
  }, [locale]);

  // ====== Handle Images ======
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // ====== Handle Form Change ======
  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [locale]: { ...prev[locale], [field]: value },
    }));
  };

  // ====== Submit ======
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!form.mm.title.trim() && !form.en.title.trim()) {
        alert("Please enter at least one title (MM or EN)");
        return;
      }

      const formData = new FormData();
      // MM fields
      formData.append("title", form.mm.title);
      formData.append("introtext", form.mm.introtext);
      formData.append("fulltext", form.mm.fulltext);
      // EN fields
      // formData.append("title_en", form.en.title);
      // formData.append("introtext_en", form.en.introtext);
      // formData.append("fulltext_en", form.en.fulltext);

      if (category) formData.append("catid", category.value);
      images.forEach((file, idx) => formData.append(`images[${idx}]`, file));

      await api.post("/v1/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate("/admini/posts?message=Posts created successfully!&type=success");
    } catch (err) {
      alert(
        "Failed to create post: " + (err.response?.data?.message || err.message)
      );
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100 min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Create Post</h1>

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
          {/* Title */}
          <input
            type="text"
            placeholder="Title"
            className="w-full border p-2 rounded"
            value={form[locale].title}
            onChange={(e) => handleChange("title", e.target.value)}
            required
          />

          {/* Intro Text */}
          <textarea
            placeholder="Intro text"
            className="w-full border p-2 rounded"
            value={form[locale].introtext}
            onChange={(e) => handleChange("introtext", e.target.value)}
          />

          {/* Full Text */}
          <div>
            <label className="block mb-1 font-medium">Full Text</label>
            <Editor
              apiKey="clt4eglgtx991vgng3hq7w2d8l3wmlry4h1dack3wvgqars6"
              value={form[locale].fulltext}
              init={{
                height: 400,
                menubar: true,
                plugins: [
                  "advlist","autolink","lists","link","image","charmap","preview","anchor",
                  "searchreplace","visualblocks","code","fullscreen","insertdatetime",
                  "media","table","help","wordcount"
                ],
                toolbar:
                  "undo redo | formatselect | bold italic underline strikethrough | " +
                  "alignleft aligncenter alignright alignjustify | " +
                  "bullist numlist outdent indent | link image media | " +
                  "forecolor backcolor removeformat | code fullscreen",
                file_picker_callback: filePickerCallback,
                content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }"
              }}
              onEditorChange={(content) => handleChange("fulltext", content)}
            />
          </div>

          {/* Category */}
          <div>
            <label className="block mb-1 font-medium">Category</label>
            <Select
              options={categories}
              value={category}
              onChange={setCategory}
              placeholder="Select Category"
            />
          </div>

          {/* Images */}
          <div>
            <label className="block mb-1 font-medium">Images</label>
            <div className="flex gap-2 mb-2">
              {images.map((file, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`new-${idx}`}
                    className="w-[100px] h-[100px] object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 text-xs"
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

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow font-medium transition"
            >
              ✅ Create Post
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


