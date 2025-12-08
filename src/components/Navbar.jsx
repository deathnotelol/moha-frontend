
import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown, Search, ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/axios";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [menus, setMenus] = useState([]);

  // 🌐 Language from localStorage or default mm
  const [lang, setLang] = useState(localStorage.getItem("lang") || "mm");

  const [open, setOpen] = useState(false);
  const [desktopHover, setDesktopHover] = useState(null);
  const [mobileOpen, setMobileOpen] = useState({});
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const searchRef = useRef(null);

  // 🚀 Load menus based on Language
  useEffect(() => {
    const apiUrl = lang === "mm" ? "/menus" : "/en/menus";

    api
      .get(apiUrl)
      .then((res) => setMenus(res.data))
      .catch((err) => console.log(err));
  }, [lang]);

  // 🌐 Language Switch Handler
  const handleLangChange = (newLang) => {
    if (newLang === lang) return;

    setLang(newLang);
    localStorage.setItem("lang", newLang);

    // 🔥 Always redirect to root language page
    if (newLang === "mm") {
      navigate("/mm");
    } else {
      navigate("/en");
    }
  };

  // 🔍 Search box outside click
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // 🔎 Search Submit
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    navigate(`/${lang}/search?q=${searchQuery}`);
    setSearchQuery("");
    setSearchOpen(false);
  };

  // Render Dropdown Recursive
  const renderMenu = (items, level = 0, isMobile = false) => (
    <ul
      className={`${
        isMobile
          ? "flex flex-col"
          : "absolute bg-blue-700 shadow rounded border border-blue-300 w-max min-w-max whitespace-nowrap"
      } ${level > 0 && !isMobile ? "left-full top-0" : ""}`}
    >
      {items.map((item) => {
        const hasChildren = item.children && item.children.length > 0;

        return (
          <li key={item.id} className="relative group">
            {/* Item */}
            {isMobile ? (
              <div
                className="flex justify-between items-center px-4 py-2 hover:bg-green-500 cursor-pointer"
                onClick={() =>
                  hasChildren
                    ? setMobileOpen((p) => ({ ...p, [item.id]: !p[item.id] }))
                    : navigate(`/${lang}${item.url}`)
                }
              >
                <span>{item.title}</span>
                {hasChildren && (
                  <ChevronDown
                    className={`transition ${
                      mobileOpen[item.id] ? "rotate-180" : ""
                    }`}
                  />
                )}
              </div>
            ) : (
              <div
                className="px-4 py-2 hover:bg-green-500 cursor-pointer whitespace-nowrap inline-block"
                onClick={() => !hasChildren && navigate(`/${lang}${item.url}`)}
              >
                {item.title}
              </div>
            )}

            {/* Children */}
            {hasChildren && (
              <>
                {isMobile ? (
                  <div
                    className={`ml-4 overflow-hidden transition-all ${
                      mobileOpen[item.id] ? "max-h-screen" : "max-h-0"
                    }`}
                  >
                    {renderMenu(item.children, level + 1, true)}
                  </div>
                ) : (
                  <div className="hidden group-hover:block">
                    {renderMenu(item.children, level + 1)}
                  </div>
                )}
              </>
            )}
          </li>
        );
      })}
    </ul>
  );

  return (
    <nav className="fixed w-full top-0 left-0 bg-blue-700 shadow z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3">
        {/* Logo */}
        <img
          src={`${process.env.PUBLIC_URL}/images/logo.png`}
          className="h-16"
          alt="logo"
        />

        {/* Search Open */}
        {searchOpen ? (
          <div ref={searchRef} className="flex-1 flex justify-center">
            <form
              onSubmit={handleSearch}
              className="flex items-center w-full max-w-xl bg-white rounded-lg px-3 py-2"
            >
              <ArrowLeft
                className="mr-3 cursor-pointer"
                onClick={() => setSearchOpen(false)}
              />

              <input
                className="flex-1 outline-none"
                placeholder={lang === "mm" ? "ရှာမယ်…" : "Search…"}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              <button className="bg-blue-600 text-white px-4 py-2 rounded">
                {lang === "mm" ? "ရှာမယ်" : "Search"}
              </button>
            </form>
          </div>
        ) : (
          <>
            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-6 text-white font-semibold">
              {menus.map((m, i) => (
                <div
                  key={i}
                  className="relative"
                  onMouseEnter={() => setDesktopHover(i)}
                  onMouseLeave={() => setDesktopHover(null)}
                >
                  <div
                    className="px-3 py-2 hover:text-green-400 cursor-pointer"
                    onClick={() =>
                      !m.children?.length && navigate(`/${lang}${m.url}`)
                    }
                  >
                    {m.title}
                    {m.children?.length > 0 && (
                      <ChevronDown size={14} className="inline ml-1" />
                    )}
                  </div>

                  {m.children?.length > 0 && desktopHover === i && (
                    <div className="absolute left-0 top-full mt-1">
                      {renderMenu(m.children)}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Search + Language + Mobile */}
            <div className="flex items-center space-x-4">
              {/* 🌐 Language Switch */}
              <div className="flex space-x-1">
                <button
                  className={`px-2 py-1 rounded ${
                    lang === "mm"
                      ? "bg-green-500 text-white"
                      : "bg-blue-900 text-white"
                  }`}
                  onClick={() => handleLangChange("mm")}
                >
                  MM
                </button>

                <button
                  className={`px-2 py-1 rounded ${
                    lang === "en"
                      ? "bg-green-500 text-white"
                      : "bg-blue-900 text-white"
                  }`}
                  onClick={() => handleLangChange("en")}
                >
                  EN
                </button>
              </div>

              <Search
                className="text-white cursor-pointer"
                onClick={() => setSearchOpen(true)}
              />

              <div className="md:hidden">
                <button onClick={() => setOpen(!open)}>
                  {open ? <X size={28} /> : <Menu size={28} />}
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Mobile Menu */}
      {!searchOpen && open && (
        <div className="md:hidden bg-white px-4 py-4">
          {menus.map((m) => (
            <div key={m.id} className="mb-2">
              {renderMenu([m], 0, true)}
            </div>
          ))}

          {/* Mobile Lang */}
          <div className="mt-3 flex space-x-2">
            <button
              className={`px-3 py-2 rounded ${
                lang === "mm" ? "bg-green-600 text-white" : "bg-gray-200"
              }`}
              onClick={() => handleLangChange("mm")}
            >
              MM
            </button>

            <button
              className={`px-3 py-2 rounded ${
                lang === "en" ? "bg-green-600 text-white" : "bg-gray-200"
              }`}
              onClick={() => handleLangChange("en")}
            >
              EN
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
