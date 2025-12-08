import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";
import { BookOpen, FileText, Scale } from "lucide-react"; // Icon တွေ import
import { useLocation } from "react-router-dom";

export default function FeaturesBotton() {
  const [newsletters, setNewsletters] = useState([]);
  const [tenders, setTenders] = useState([]);
  const [lawPost, setLawPost] = useState(null);
  const location = useLocation();
  const isEnglish = location.pathname.startsWith("/en");

  useEffect(() => {
    fetchPostsByCategory(6, setNewsletters); // newsletters
    fetchPostsByCategory(8, setTenders); // tenders
    fetchLawPost(); // laws (id=14051)
  }, []);

  const fetchPostsByCategory = async (categoryId, setter) => {
    try {
      const res = await api.get(`/posts?category_id=${categoryId}&limit=9`);
      // API က ၉ ခုလာမယ်ဆိုရင်
      const onlyFive = (res.data.data || []).slice(0, 5); // ၅ ခုထိပဲထားမယ်
      setter(onlyFive);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchLawPost = async () => {
    try {
      const res = await api.get(`/posts/5e656d02-ca82-11f0-9d87-00155d100213`);
      setLawPost(res.data || null);
    } catch (err) {
      console.error(err);
    }
  };

  // lawPost ထဲက HTML table ကို preview အနည်းငယ်ပဲပြမယ်
  const getTablePreview = (html) => {
    if (!html) return "";
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const table = doc.querySelector("table");
    if (!table) return "";

    // စာရင်းအတိုင်း first 3 rows ထဲကအပိုင်းကို clone
    const rows = Array.from(table.querySelectorAll("tr")).slice(0, 3);
    const previewTable = document.createElement("table");
    previewTable.className = "table-preview";
    rows.forEach((row) => previewTable.appendChild(row.cloneNode(true)));

    return previewTable.outerHTML;
  };

  return (
    <section className="py-16 bg-gradient-to-b from-blue-200 via-blue-100 to-blue-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-10">
          {/* သတင်းလွှာ */}
          <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col justify-between">
            <div className="flex flex-col items-center mb-6">
              <BookOpen className="w-10 h-10 text-blue-600 mb-2" />
              <h3 className="text-2xl font-extrabold text-blue-600">
                {isEnglish ? "MOHA News Papers" : "ပြည်ထဲရေးသတင်းလွှာ"} 
              </h3>
            </div>
            <ul className="space-y-4">
              {newsletters.map((post) => (
                <li key={post.id} className="border-b pb-2">
                  <Link
                    to={`/mm/posts/${post.uuid}`}
                    className="text-gray-800 hover:text-blue-500 font-medium line-clamp-1"
                  >
                    {post.title}
                  </Link>
                  <p className="text-gray-500 text-sm">
                    {new Date(post.created_at).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
            <div className="mt-4 text-center">
              <Link
                to="/mm/newsletters"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-full transition"
              >
                {isEnglish ? "Read More" : "အသေးစိတ်ကြည့်ရှုရန်"}
              </Link>
            </div>
          </div>

          {/* တင်ဒါ */}
          <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col justify-between">
            <div className="flex flex-col items-center mb-6">
              <FileText className="w-10 h-10 text-green-600 mb-2" />
              <h3 className="text-2xl font-extrabold text-green-600">
                { isEnglish ? "Tender Announcements" : "တင်ဒါထုတ်ပြန်ချက်များ"}
              </h3>
            </div>
            <ul className="space-y-4">
              {tenders.map((post) => (
                <li key={post.id} className="border-b pb-2">
                  <Link
                    to={`/mm/posts/${post.uuid}`}
                    className="text-gray-800 hover:text-green-600 font-medium line-clamp-1"
                  >
                    {post.title}
                  </Link>
                  <p className="text-gray-500 text-sm">
                    {new Date(post.created_at).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
            <div className="mt-4 text-center">
              <Link
                to="/mm/tenders"
                className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded-full transition"
              >
                {isEnglish ? "Read More" : "အသေးစိတ်ကြည့်ရှုရန်"}
              </Link>
            </div>
          </div>

          {/* ဥပဒေကဏ္ဍ */}
          <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col justify-between">
            <div className="flex flex-col items-center mb-6">
              <Scale className="w-10 h-10 text-blue-600 mb-2" />
              <h3 className="text-2xl font-extrabold text-blue-600">
                { isEnglish ? "Law Section": "ဥပဒေကဏ္ဍ"}
              </h3>
            </div>
            <div className="flex flex-col items-center text-center">
              <img
                src={`${process.env.PUBLIC_URL}/images/law-icon.png`} // public/images/law-icon.png ထဲသိမ်းထားနိုင်ပါတယ်
                alt="ဥပဒေကဏ္ဍ"
                className="w-56 h-56 mb-4"
              />
              <p className="text-gray-700 leading-relaxed">
                { isEnglish ? "This section provides a compilation of laws, bylaws, orders, and regulations." : "ဥပဒေများ၊ နည်းဥပဒေများ၊ အမိန့်များနှင့် စည်းမျဉ်းစည်းကမ်းများကိုစုဆောင်းဖော်ပြထားသော ဥပဒေကဏ္ဍ ဖြစ်ပါသည်။"}
              </p>
            </div>
            <div className="mt-6 text-center">
              <Link
                to="/mm/posts/5e656d02-ca82-11f0-9d87-00155d100213"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-full transition"
              >
                {isEnglish ? "Read More" : "အသေးစိတ်ကြည့်ရှုရန်"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

