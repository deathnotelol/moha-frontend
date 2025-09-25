import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";

import Posts from "./pages/admin/posts/Posts";
import PostCreate from "./pages/admin/posts/PostCreate";
import PostEdit from "./pages/admin/posts/PostEdit";

import PostDetail from "./pages/PostDetail";
import Media from "./pages/Media";

import ManageMenus from "./pages/admin/ManageMenus";

import Categories from "./pages/admin/categories/Categories";
import CategoryCreate from "./pages/admin/categories/CategoryCreate";
import CategoryEdit from "./pages/admin/categories/CategoryEdit";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/admini" replace />;
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Laravel File Manager route should not be captured by React Router */}
        {/* So do NOT define a route like "/laravel-filemanager" here */}

        {/* SPA routes */}
        <Route path="/" element={<Home />} />
        <Route path="/media" element={<Media />} />
        <Route path="/posts/:id" element={<PostDetail />} />
        <Route path="/admini" element={<Login />} />
        <Route
          path="/admini/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admini/posts"
          element={
            <PrivateRoute>
              <Posts />
            </PrivateRoute>
          }
        />
        <Route
          path="/admini/posts/create"
          element={
            <PrivateRoute>
              <PostCreate />
            </PrivateRoute>
          }
        />
        <Route
          path="/admini/posts/edit/:id"
          element={
            <PrivateRoute>
              <PostEdit />
            </PrivateRoute>
          }
        />
        {/* Categories */}

        <Route path="/admini/categories" element={<Categories />} />
        <Route path="/admini/categories/create" element={<CategoryCreate />} />
        <Route path="/admini/categories/edit/:id" element={<CategoryEdit />} />

        {/* Menus Manage */}
        <Route
          path="/admini/menus"
          element={
            <PrivateRoute>
              <ManageMenus />
            </PrivateRoute>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
