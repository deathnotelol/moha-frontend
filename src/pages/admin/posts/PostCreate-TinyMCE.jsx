/* global tinymce */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import { Editor } from "@tinymce/tinymce-react";
import Select from "react-select";
import Sidebar from "../../../components/Sidebar";

export default function PostCreate() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [introtext, setIntrotext] = useState("");
  const [fulltext, setFulltext] = useState("");
  const [category, setCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);

  // Fetch categories from API
  useEffect(() => {
    api.get("/categories").then((res) => {
      const options = res.data.map((c) => ({ value: c.id, label: c.title }));
      setCategories(options);
    });
  }, []);

  // Handle file input
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  // File manager integration

  const filePickerCallback = (callback, value, meta) => {
    const x = window.innerWidth * 0.8;
    const y = window.innerHeight * 0.8;

    const token = localStorage.getItem("token"); // JWT token ကို ယူမယ်
    const cmsURL = `https://10.10.6.15/moha-api/laravel-filemanager?editor=${meta.fieldname}&type=${meta.filetype}&token=${token}`;

    tinymce.activeEditor.windowManager.openUrl({
      url: cmsURL,
      title: "File Manager",
      width: x,
      height: y,
      resizable: "yes",
      close_previous: "no",
      // ✅ tinymce 5 အတွက် origin mismatch issue ကိုဖြေရှင်း
      onMessage: (api, message) => {
        // message.origin ကို check လုပ်ပြီး accept
        const allowedOrigins = [
          "https://10.10.6.15", // Laravel backend
          "https://10.10.6.15:3001", // React dev server
        ];

        if (!allowedOrigins.includes(message.origin)) return;

        if (message.mceAction === "fileSelected") {
          callback(message.content);
          api.close();
        }
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("introtext", introtext);
      formData.append("fulltext", fulltext);
      formData.append("catid", category.value);
      images.forEach((file, idx) => formData.append(`images[${idx}]`, file));

      await api.post("/v1/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Post created successfully!");
      navigate("/admini/posts");
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
        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-white p-6 rounded-lg shadow"
        >
          <input
            type="text"
            placeholder="Title"
            className="w-full border p-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Intro text"
            className="w-full border p-2 rounded"
            value={introtext}
            onChange={(e) => setIntrotext(e.target.value)}
          />
          <div>
            <label className="block mb-1 font-medium">Full Text</label>
            <Editor
              apiKey="clt4eglgtx991vgng3hq7w2d8l3wmlry4h1dack3wvgqars6"
              value={fulltext}
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
                  //   "print",
                  "preview",
                  "anchor",
                  "searchreplace",
                  "visualblocks",
                  "code",
                  "fullscreen",
                  "insertdatetime",
                  "media",
                  "table",
                  //   "paste",
                  "help",
                  "wordcount",
                ],
                toolbar:
                  "undo redo | formatselect | bold italic underline strikethrough | " +
                  "alignleft aligncenter alignright alignjustify | " +
                  "bullist numlist outdent indent | link image media | " +
                  "forecolor backcolor removeformat | code fullscreen",
                file_picker_callback: filePickerCallback,
                content_style:
                  "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
              }}
              onEditorChange={(content) => setFulltext(content)}
            />
            {/* <textarea
            placeholder="Intro text"
            className="w-full border p-2 rounded"
            value={fulltext}
            onChange={(e) => setFulltext(e.target.value)}
          /> */}
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
            <label className="block mb-1 font-medium">Images</label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="border p-2 rounded"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Submit Post
          </button>
        </form>
      </div>
    </div>
  );
}
