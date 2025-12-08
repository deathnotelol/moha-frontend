import { Link } from "react-router-dom";

export default function Sidebar() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col min-h-screen">
      {/* Header */}
      <div className="p-4 text-2xl font-bold border-b border-gray-700">
        Admin Panel
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <Link
          to="/admini/dashboard"
          className="block p-2 rounded hover:bg-gray-700 transition"
        >
          Dashboard
        </Link>
        {(user?.role === "admin" || user?.role === "editor") && (
          <Link
            to="/admini/posts"
            className="block p-2 rounded hover:bg-gray-700 transition"
          >
            Manage Posts
          </Link>
        )}
        {user?.role === "admin" && (
          <>
            <Link
              to="/admini/menus"
              className="block p-2 rounded hover:bg-gray-700 transition"
            >
              Manage Menus
            </Link>
            <Link
              to="/admini/categories"
              className="block p-2 rounded hover:bg-gray-700 transition"
            >
              Categories
            </Link>
          </>
        )}
        <Link
          to="/"
          className="block p-2 rounded hover:bg-gray-700 transition"
        >
          Go to Site
        </Link>
      </nav>

      {/* Logout */}
      <button
        onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/admini";
        }}
        className="p-4 bg-red-600 hover:bg-red-700 transition"
      >
        Logout
      </button>
    </div>
  );
}
