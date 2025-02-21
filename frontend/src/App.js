import { useMemo } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "leaflet/dist/leaflet.css";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import "./App.css";
import { ThemeProvider } from "@mui/material";
import createTheme from "@mui/material/styles/createTheme";
import { themeSettings } from "./theme.js";
import ArticleDetailPage from "./pages/articleDetail/ArticleDetailPage";
import HomePage from "./pages/home/HomePage";
import RegisterPage from "./pages/register/RegisterPage";
import LoginPage from "./pages/login/LoginPage";

/** admin screens
 */
import AdminLayout from "./pages/admin/AdminLayout";
import Admin from "./pages/admin/screens/Admin";
import Categories from "./pages/admin/screens/categories/Categories";
import EditCategories from "./pages/admin/screens/categories/EditCategories";
import Users from "./pages/admin/screens/users/Users";
import ManagePosts from "./pages/admin/screens/posts/ManagePosts";
import ManageExperiences from "./pages/admin/screens/experiences/ManageExperiences";
import ExperienceForm from "./pages/admin/screens/experiences/ExperienceForm.jsx";

/** blog */
import BlogPage from "./pages/blog/BlogPage";
import PostFormPage from "./pages/user/screens/posts/PostFormPage.jsx";

import Comments from "./pages/admin/screens/comments/Comments";
import Reviews from "./pages/admin/screens/reviews/Reviews";
import AboutPage from "./pages/about/AboutPage";

/** experience  */
import ExperiencePage from "./pages/experience/ExperiencePage";
import ExperienceDetailPage from "./pages/experienceDetail/ExperienceDetailPage";

/** user */
import ProfilePage from "./pages/user/screens/User";
import UserLayout from "./pages/user/UserLayout";
import UserManagePosts from "./pages/user/screens/posts/ManagePosts";
import UserManageExperiences from "./pages/user/screens/experiences/ManageExperiences";
import ManageFavorites from "./pages/user/screens/favorites/ManageFavorites";
import UserEditPost from "./pages/user/screens/posts/PostFormPage.jsx";
import UserEditExperience from "./pages/user/screens/experiences/EditExperience";

/** itineraries */
import ManageItineraries from "./pages/user/screens/itineraries/ManageItineraries";
import EditItinerary from "./pages/user/screens/itineraries/EditItinerary";
import CreateItinerary from "./pages/user/screens/itineraries/CreateItinerary";
import ItineraryDetailPage from "./pages/user/screens/itineraries/ItineraryDetailPage";

/** chatbot */
import ChatWithBot from "./pages/user/screens/chat/ChatWithBot";

/** not found */
import NotFound from "./pages/NotFound.jsx";

function App() {
  const mode = useSelector((state) => state.theme.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  useEffect(() => {
    document.body.style.setProperty(
      "--bg-color",
      theme.palette.background.default
    );
    document.body.style.setProperty("--text-color", theme.palette.text.primary);
  }, [theme]);

  return (
    <ThemeProvider theme={theme}>
      <div className="App font-opensans">
        <Routes>
          <Route index path="/" element={<HomePage />} />
          <Route path="/experience" element={<ExperiencePage />} />
          <Route path="/experience/:slug" element={<ExperienceDetailPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/blog/:slug" element={<ArticleDetailPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route
            path="experiences/manage/edit/:slug"
            element={<ExperienceForm />}
          />
          <Route path="posts/manage/create" element={<PostFormPage />} />
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Admin />} />
            <Route path="comments" element={<Comments />} />
            <Route path="reviews" element={<Reviews />} />
            <Route path="posts/manage" element={<ManagePosts />} />
            <Route path="experiences/manage" element={<ManageExperiences />} />
            <Route path="posts/manage/create" element={<PostFormPage />} />
            <Route
              path="experiences/manage/edit/:slug"
              element={<ExperienceForm />}
            />
            <Route
              path="experiences/manage/create"
              element={<ExperienceForm />}
            />
            <Route path="categories/manage" element={<Categories />} />
            <Route
              path="categories/manage/edit/:slug"
              element={<EditCategories />}
            />
            <Route path="users/manage" element={<Users />} />
          </Route>
          <Route path="/user" element={<UserLayout />}>
            <Route path="posts/manage" element={<UserManagePosts />} />
            <Route
              path="experiences/manage"
              element={<UserManageExperiences />}
            />
            <Route path="comments" element={<Comments />} />
            <Route path="posts/manage/edit/:slug" element={<UserEditPost />} />
            <Route path="posts/manage/create" element={<PostFormPage />} />
            <Route
              path="experiences/manage/edit/:slug"
              element={<UserEditExperience />}
            />
            <Route path="favorites/manage" element={<ManageFavorites />} />

            <Route path="itineraries/manage" element={<ManageItineraries />} />
            <Route
              path="itineraries/manage/create"
              element={<CreateItinerary />}
            />
            <Route
              path="itineraries/manage/edit/:id"
              element={<EditItinerary />}
            />
            <Route
              path="itineraries/manage/view/:id"
              element={<ItineraryDetailPage />}
            />
            <Route path="chat/bot" element={<ChatWithBot />} />
          </Route>
          {/* User Routes */}
          <Route path="/user" element={<UserLayout />}>
            <Route path="profile" element={<ProfilePage />} />
            <Route
              path="experiences/manage"
              element={<UserManageExperiences />}
            />
            <Route
              path="experiences/manage/edit/:slug"
              element={<ExperienceForm />}
            />
            <Route
              path="experiences/manage/create"
              element={<ExperienceForm />}
            />
            <Route path="favorites/manage" element={<ManageFavorites />} />
          </Route>
          {/* 404 Not Found route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </div>
    </ThemeProvider>
  );
}

export default App;
