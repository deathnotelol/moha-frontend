import { Link } from "react-router-dom";

export default function Sidebar() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="w-64 h-screen bg-gray-800 text-white flex flex-col">
      <div className="p-4 text-2xl font-bold border-b border-gray-700">
        Admin Panel
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <Link to="/admini/dashboard" className="block p-2 rounded hover:bg-gray-700">
          Dashboard
        </Link>
        {(user?.role === "admin" || user?.role === "editor") && (
          <Link to="/admini/posts" className="block p-2 rounded hover:bg-gray-700">
            Manage Posts
          </Link>
        )}
        {user?.role === "admin" && (
          <>
            <Link to="/admini/menus" className="block p-2 rounded hover:bg-gray-700">
              Manage Menus
            </Link>
            <Link to="/admini/users" className="block p-2 rounded hover:bg-gray-700">
              Manage Users
            </Link>
            <Link to="/admini/categories" className="block p-2 rounded hover:bg-gray-700">
              Categories
            </Link>
          </>
        )}
        <Link to="/" className="block p-2 rounded hover:bg-gray-700">
          Go to Site
        </Link>
      </nav>
      <button
        onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/admini";
        }}
        className="p-4 bg-red-600 hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
}
