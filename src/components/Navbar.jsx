// import { useState, useEffect } from "react";
// import { Menu, X, ChevronDown } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import api from "../api/axios";

// export default function Navbar() {
//   const [menus, setMenus] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [desktopHover, setDesktopHover] = useState(null);
//   const [mobileOpen, setMobileOpen] = useState({});
//   const navigate = useNavigate();

//   useEffect(() => {
//     api.get("/menus")
//       .then(res => setMenus(res.data))
//       .catch(err => console.error(err));
//   }, []);

//   const toggleMobile = (id) => {
//     setMobileOpen(prev => ({ ...prev, [id]: !prev[id] }));
//   };

//   // ✅ menu click handler
//   const handleMenuClick = (item) => {
//     if (item.post_id) {
//       navigate(`/posts/${item.post_id}`);
//     } else if (item.url) {
//       navigate(item.url);
//     }
//   };

//   const renderMenu = (items, level = 0, isMobile = false) => (
//     <ul
//       className={`${isMobile ? "flex flex-col" : "absolute bg-[#1D4ED8] shadow-md rounded border border-blue-200"} 
//         ${level > 0 && !isMobile ? "top-0 left-full mt-1 inline-block whitespace-nowrap min-w-[200px]" : ""}`}
//     >
//       {items.map(item => {
//         const hasChildren = item.children && item.children.length > 0;
//         return (
//           <li key={item.id} className="relative group">
//             {isMobile ? (
//               <div
//                 className="flex justify-between items-center px-4 py-2 hover:bg-[#12b903] cursor-pointer"
//                 onClick={() => hasChildren ? toggleMobile(item.id) : handleMenuClick(item)}
//               >
//                 <span className="flex-1 whitespace-normal break-words">
//                   {item.title}
//                 </span>
//                 {hasChildren && (
//                   <ChevronDown
//                     size={16}
//                     className={`transition-transform duration-300 ${mobileOpen[item.id] ? "rotate-180" : "rotate-0"}`}
//                   />
//                 )}
//               </div>
//             ) : (
//               <div
//                 className="flex justify-between items-center px-4 py-2 hover:bg-[#12b903] whitespace-nowrap cursor-pointer"
//                 onClick={() => !hasChildren && handleMenuClick(item)}
//               >
//                 {item.title}
//                 {hasChildren && <ChevronDown size={16} className="ml-1" />}
//               </div>
//             )}

//             {hasChildren && (
//               <>
//                 {isMobile ? (
//                   <div className={`ml-4 overflow-hidden transition-all duration-300 ${mobileOpen[item.id] ? "max-h-screen" : "max-h-0"}`}>
//                     {renderMenu(item.children, level + 1, isMobile)}
//                   </div>
//                 ) : (
//                   <div className="hidden group-hover:block">{renderMenu(item.children, level + 1)}</div>
//                 )}
//               </>
//             )}
//           </li>
//         );
//       })}
//     </ul>
//   );

//   return (
//     <nav className="fixed top-0 left-0 w-full bg-[#1D4ED8] shadow z-50">
//       <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
//         {/* Logo */}
//         <div className="flex items-center space-x-3">
//           <img src="/images/logo.png" alt="Logo" className="h-16" />
//         </div>

//         {/* Desktop Menu */}
//         <div className="hidden md:flex space-x-6 font-semibold text-white relative">
//           {menus.map((item, idx) => (
//             <div
//               key={idx}
//               className="relative group"
//               onMouseEnter={() => setDesktopHover(idx)}
//               onMouseLeave={() => setDesktopHover(null)}
//             >
//               <div
//                 onClick={() => !item.children?.length && handleMenuClick(item)}
//                 className="flex items-center px-3 py-2 hover:text-green-600 cursor-pointer"
//               >
//                 {item.title}
//                 {item.children && item.children.length > 0 && <ChevronDown size={16} className="ml-1" />}
//               </div>

//               {/* Dropdown */}
//               {item.children && item.children.length > 0 && desktopHover === idx && (
//                 <div className="absolute top-full left-0 mt-1">
//                   {renderMenu(item.children)}
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>

//         {/* Mobile Toggle */}
//         <div className="md:hidden">
//           <button onClick={() => setOpen(!open)}>
//             {open ? <X size={28} /> : <Menu size={28} />}
//           </button>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       {open && (
//         <div className="md:hidden bg-white border-t shadow px-4 py-4">
//           {menus.map(item => (
//             <div key={item.id} className="mb-2">
//               {renderMenu([item], 0, true)}
//             </div>
//           ))}
//         </div>
//       )}
//     </nav>
//   );
// }

import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown, Search, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Navbar() {
  const [menus, setMenus] = useState([]);
  const [open, setOpen] = useState(false);
  const [desktopHover, setDesktopHover] = useState(null);
  const [mobileOpen, setMobileOpen] = useState({});
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  // const [searchResults, setSearchResults] = useState([]);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/menus")
      .then(res => setMenus(res.data))
      .catch(err => console.error(err));
  }, []);

  // click outside => close search
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
    };
    if (searchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchOpen]);

  const toggleMobile = (id) => {
    setMobileOpen(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleMenuClick = (item) => {
    if (item.post_id) {
      navigate(`/posts/${item.post_id}`);
    } else if (item.url) {
      navigate(item.url);
    }
  };

  const handleSearch = (e) => {
  e.preventDefault();
  if (!searchQuery.trim()) return;
  navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
  setSearchOpen(false);
};

  const renderMenu = (items, level = 0, isMobile = false) => (
    <ul
      className={`${
        isMobile
          ? "flex flex-col"
          : "absolute bg-[#1D4ED8] shadow-md rounded border border-blue-200"
      } 
      ${level > 0 && !isMobile ? "top-0 left-full mt-1 min-w-[200px]" : ""}`}
    >
      {items.map(item => {
        const hasChildren = item.children && item.children.length > 0;
        return (
          <li key={item.id} className="relative group">
            {isMobile ? (
              <div
                className="flex justify-between items-center px-4 py-2 hover:bg-[#12b903] cursor-pointer"
                onClick={() =>
                  hasChildren ? toggleMobile(item.id) : handleMenuClick(item)
                }
              >
                <span className="flex-1">{item.title}</span>
                {hasChildren && (
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-300 ${
                      mobileOpen[item.id] ? "rotate-180" : "rotate-0"
                    }`}
                  />
                )}
              </div>
            ) : (
              <div
                className="flex items-center px-4 py-2 hover:bg-[#12b903] cursor-pointer whitespace-nowrap"
                onClick={() => !hasChildren && handleMenuClick(item)}
              >
                {item.title}
                {hasChildren && <ChevronDown size={16} className="ml-1" />}
              </div>
            )}

            {hasChildren && (
              <>
                {isMobile ? (
                  <div
                    className={`ml-4 overflow-hidden transition-all duration-300 ${
                      mobileOpen[item.id] ? "max-h-screen" : "max-h-0"
                    }`}
                  >
                    {renderMenu(item.children, level + 1, isMobile)}
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
    <nav className="fixed top-0 left-0 w-full bg-[#1D4ED8] shadow z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <img src="/images/logo.png" alt="Logo" className="h-16" />
        </div>

        {/* If Search Open => Show Search Box only */}
        {searchOpen ? (
          <div className="flex-1 flex justify-center" ref={searchRef}>
            <form
              onSubmit={handleSearch}
              className="flex items-center w-full max-w-xl bg-white rounded-lg px-3 py-2 shadow"
            >
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="mr-2 text-gray-500 hover:text-black"
              >
                <ArrowLeft size={20} />
              </button>
              <input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-2 py-1 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Search
              </button>
            </form>
          </div>
        ) : (
          <>
            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-6 font-semibold text-white relative">
              {menus.map((item, idx) => (
                <div
                  key={idx}
                  className="relative group"
                  onMouseEnter={() => setDesktopHover(idx)}
                  onMouseLeave={() => setDesktopHover(null)}
                >
                  <div
                    onClick={() =>
                      !item.children?.length && handleMenuClick(item)
                    }
                    className="flex items-center px-3 py-2 hover:text-green-400 cursor-pointer"
                  >
                    {item.title}
                    {item.children?.length > 0 && (
                      <ChevronDown size={16} className="ml-1" />
                    )}
                  </div>

                  {item.children?.length > 0 && desktopHover === idx && (
                    <div className="absolute top-full left-0 mt-1">
                      {renderMenu(item.children)}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Search + Mobile Toggle */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSearchOpen(true)}
                className="text-white hover:text-yellow-300"
              >
                <Search size={22} />
              </button>
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
        <div className="md:hidden bg-white border-t shadow px-4 py-4">
          {menus.map((item) => (
            <div key={item.id} className="mb-2">
              {renderMenu([item], 0, true)}
            </div>
          ))}
        </div>
      )}
    </nav>
  );
}

