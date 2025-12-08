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
import MediaMM from "./pages/MediaMM";
import MediaEN from "./pages/MediaEN";

import ManageMenus from "./pages/admin/ManageMenus";

import Categories from "./pages/admin/categories/Categories";
import CategoryCreate from "./pages/admin/categories/CategoryCreate";
import CategoryEdit from "./pages/admin/categories/CategoryEdit";
import SearchPage from "./components/SearchPage";
import VideoGallery from "./pages/VideoGallery";
import Announcements from "./pages/Announcements";
import NewslettersPage from "./pages/NewslettersPage";
import TendersPage from "./pages/TendersPage";
import PostDetailEn from "./pages/PostDetailEn";


function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/admini" replace />;
}

export default function App() {
  return (
    <Router>
      <Routes>


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

        <Route
          path="/admini_eng/posts"
          element={
            <PrivateRoute>
              <Posts />
            </PrivateRoute>
          }
        />
        <Route
          path="/admini_eng/posts/create"
          element={
            <PrivateRoute>
              <PostCreate />
            </PrivateRoute>
          }
        />
        <Route
          path="/admini_eng/posts/edit/:id"
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

        <Route path="/admini_eng/categories" element={<Categories />} />
        <Route path="/admini_eng/categories/create" element={<CategoryCreate />} />
        <Route path="/admini_eng/categories/edit/:id" element={<CategoryEdit />} />

        {/* Menus Manage */}
        <Route
          path="/admini/menus"
          element={
            <PrivateRoute>
              <ManageMenus />
            </PrivateRoute>
          }
        />
        <Route path="/admini" element={<Login />} />

        {/* SPA routes */}
        {/* <Route path="/" element={<Home />} />
        <Route path="/media" element={<Media />} />
        <Route path="/posts/:id" element={<PostDetail />} />
        <Route path="/admini" element={<Login />} />
        
        <Route path="/search" element={<SearchPage />} />

        <Route path="/videos" element={<VideoGallery />} />

         <Route path="/announcments" element={<Announcements />} />

         <Route path="/newsletters" element={<NewslettersPage />} />

         <Route path="/tenders" element={<TendersPage />} /> */}

         <Route path="mm/announcments" element={<Announcements />} />
         
        {/* Myanmar Public */}
        <Route path="/" element={<Navigate to="/mm" replace />} />
        <Route path="/mm" element={<Home lang="mm" />} />
        <Route path="/mm/posts/:id" element={<PostDetail lang="mm" />} />
        <Route path="/mm/media" element={<MediaMM lang="mm" />} />
        <Route path="/mm/search" element={<SearchPage lang="mm" />} />
        <Route path="/mm/videos" element={<VideoGallery lang="mm" />} />
        <Route path="/mm/announcements" element={<Announcements lang="mm" />} />
        <Route path="/mm/newsletters" element={<NewslettersPage lang="mm" />} />
        <Route path="/mm/tenders" element={<TendersPage lang="mm" />} />

        {/* English Public */}
        <Route path="/en" element={<Home lang="en" />} />
        <Route path="/en/posts/:id" element={<PostDetailEn lang="en" />} />
        <Route path="/en/media" element={<MediaEN lang="en" />} />
        <Route path="/en/search" element={<SearchPage lang="en" />} />
        <Route path="/en/videos" element={<VideoGallery lang="en" />} />
        <Route path="/en/announcements" element={<Announcements lang="en" />} />
        <Route path="/en/newsletters" element={<NewslettersPage lang="en" />} />
        <Route path="/en/tenders" element={<TendersPage lang="en" />} />


        {/* Catch all */}
        {/* <Route path="*" element={<Navigate to="/" />} /> */}
      </Routes>
    </Router>
  );
}

