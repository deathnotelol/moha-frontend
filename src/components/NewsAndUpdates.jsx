// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import api from "../api/axios";
// import { motion } from "framer-motion";

// export default function NewsAndUpdates() {
//   const [posts, setPosts] = useState([]);

//   useEffect(() => {
//     fetchPosts();
//   }, []);

//   async function fetchPosts() {
//     try {
//       // ✅ API ကနေတဆင့် category_id=1 အတွက်တင်ယူမယ်
//       const res = await api.get("/posts?category_id=1");
//       const allPosts = res.data.data || [];

//       // ✅ ပထမဆုံး ၄ ခုထိသာယူမယ်
//       setPosts(allPosts.slice(0, 4));
//     } catch (err) {
//       console.error(err);
//     }
//   }

//   return (
//     <section className="py-20 bg-gradient-to-b from-blue-100 to-white relative overflow-hidden">
//       {/* subtle background decoration */}

//       <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
//         {/* Section Title */}
//         <h2 className="text-3xl font-extrabold animate-gradient
//                 bg-gradient-to-r from-blue-500 via-yellow-400 to-green-500 bg-[length:200%_200%] drop-shadow-lg
//                 bg-clip-text text-transparent py-3 mb-5 text-center">
//           နောက်ဆုံးရသတင်းများ
//           <span className="absolute left-0 -bottom-2 w-full h-1 bg-blue-600 rounded-full"></span>
//         </h2>
//         <p className="text-gray-600 mb-14 text-lg max-w-2xl mx-auto">
//           ပြည်ထဲရေး၀န်ကြီးဌာန၊ ပြည်ထောင်စု၀န်ကြီးရုံးနှင့် ကွပ်ကဲမှုအောက်ရှိ
//           တပ်ဖွဲ့/ဦးစီးဌာနများ၏ လှုပ်ရှားမှုသတင်းများအားဖော်ပြခြင်း
//         </p>

//         {/* Posts grid */}
//         <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
//           {posts.map((post, idx) => (
//             <motion.div
//               key={post.id}
//               initial={{ opacity: 0, y: 40 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.4, delay: idx * 0.1 }}
//               className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition transform hover:-translate-y-2 overflow-hidden flex flex-col"
//             >
//               {/* Thumbnail */}
//               {post.images && post.images.length > 0 && (
//                 <div className="overflow-hidden">
//                   <img
//                     src={`https://192.168.110.15/moha-api/public/${post.images[0]}`}
//                     alt={post.title}
//                     className="h-44 w-full object-cover transform group-hover:scale-105 transition duration-500"
//                   />
//                 </div>
//               )}

//               {/* Content */}
//               <div className="p-5 flex-1 flex flex-col">
//                 <h3 className="font-semibold text-lg mb-2 text-gray-900 line-clamp-2 group-hover:text-blue-600 transition">
//                   {post.title}
//                 </h3>
//                 <p className="text-sm text-gray-600 mb-4 line-clamp-3">
//                   {post.introtext?.replace(/<[^>]+>/g, "")}
//                 </p>

//                 {/* Detail link */}
//                 <Link
//                   to={`/posts/${post.id}`}
//                   className="mt-auto inline-block text-blue-600 hover:text-blue-800 text-sm font-medium transition"
//                 >
//                   Read More →
//                 </Link>
//               </div>
//             </motion.div>
//           ))}
//         </div>

//         {/* View All News Button */}
//         <div className="mt-14">
//           <Link
//             to="/media"
//             className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
//           >
//             View All News
//           </Link>
//         </div>
//       </div>
//     </section>
//   );
// }

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { motion } from "framer-motion";

export default function NewsAndUpdates({ lang = "mm" }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, [lang]); // <-- language change re-fetch

  async function fetchPosts() {
    try {
      // -----------------------------
      // Dynamic API Route Based on Language
      // -----------------------------
      const apiURL =
        lang === "en"
          ? "/en/posts?category_id=1" // English API
          : "/posts?category_id=1"; // Myanmar API

      const res = await api.get(apiURL);

      const allPosts = res.data.data || [];
      setPosts(allPosts.slice(0, 4));
    } catch (err) {
      console.error(err);
    }
  }

  // --------------------------
  // Language Texts
  // --------------------------
  const t = {
    mm: {
      title: "နောက်ဆုံးရသတင်းများ",
      description:
        "ပြည်ထဲရေး၀န်ကြီးဌာန၊ ပြည်ထောင်စု၀န်ကြီးရုံးနှင့် ကွပ်ကဲမှုအောက်ရှိ တပ်ဖွဲ့များ၏ လှုပ်ရှားမှုသတင်းများ",
      readmore: "ဆက်ဖတ်ရန် →",
      viewAll: "သတင်းအားလုံးကြည့်ရန်",
    },
    en: {
      title: "Latest News & Updates",
      description:
        "Updates and activities from the Ministry of Home Affairs and its departments.",
      readmore: "Read More →",
      viewAll: "View All News",
    },
  };

  const TEXT = t[lang];

  return (
    <section className="py-20 bg-gradient-to-b from-blue-100 to-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
        {/* Title */}
        <h2
          className="text-3xl font-extrabold animate-gradient 
                bg-gradient-to-r from-blue-500 via-yellow-400 to-green-500 bg-[length:200%_200%] drop-shadow-lg
                bg-clip-text text-transparent py-3 mb-5 text-center"
        >
          {TEXT.title}
          <span className="absolute left-0 -bottom-2 w-full h-1 bg-blue-600 rounded-full"></span>
        </h2>

        {/* Description */}
        <p className="text-gray-600 mb-14 text-lg max-w-2xl mx-auto">
          {TEXT.description}
        </p>

        {/* Posts Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {posts.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition transform hover:-translate-y-2 overflow-hidden flex flex-col"
            >
              {/* Image */}
              {post.images && post.images.length > 0 && (
                <div className="overflow-hidden">
                  <img
                    src={`https://192.168.110.15/moha-api/public/${post.images[0]}`}
                    alt={post.title}
                    className="h-44 w-full object-cover transform group-hover:scale-105 transition duration-500"
                  />
                </div>
              )}

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-semibold text-lg mb-2 text-gray-900 line-clamp-2 group-hover:text-blue-600 transition">
                  {post.title}
                </h3>

                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {post.introtext?.replace(/<[^>]+>/g, "")}
                </p>

                <Link
                  to={`/${lang}/posts/${post.uuid}`}
                  className="mt-auto inline-block text-blue-600 hover:text-blue-800 text-sm font-medium transition"
                >
                  {TEXT.readmore}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All News */}
        <div className="mt-14">
          <Link
            to={`/${lang}/media`}
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
          >
            {TEXT.viewAll}
          </Link>
        </div>
      </div>
    </section>
  );
}
