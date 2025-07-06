import { useMemo } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "leaflet/dist/leaflet.css";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import "./App.css";
import { ThemeProvider } from "@mui/material";
import createTheme from "@mui/material/styles/createTheme";
import { themeSettings } from "./theme.js";
import ScrollToTop from "./components/ScrollToTop";

import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

// Footer routes
import FAQPage from "./pages/terms/FAQPage.jsx";
import HelpCenterPage from "./pages/terms/HelpCenterPage.jsx";
import TermsPage from "./pages/terms/TermsPage.jsx";
import PrivacyPage from "./pages/terms/PrivacyPage.jsx";
import AccessibilityPage from "./pages/terms/AccessibilityPage.jsx";
import SiteMapPage from "./pages/terms/SiteMapPage.jsx";

// Main pages
import HomePage from "./pages/home/HomePage";
import RegisterPage from "./pages/register/RegisterPage";
import LoginPage from "./pages/login/LoginPage";
import ContactPage from "./pages/contact/ContactPage";
import EmailDetail from "./pages/admin/screens/emailweb/EmailDetail";

// Admin screens
import AdminLayout from "./pages/admin/AdminLayout";
import AdminImport from "./pages/admin/screens/import/AdminImport.jsx";
import ManageEmails from "./pages/admin/screens/emailweb/ManageEmails.jsx";
import Admin from "./pages/admin/screens/Admin";
import Categories from "./pages/admin/screens/categories/Categories";
import EditCategories from "./pages/admin/screens/categories/EditCategories";
import Users from "./pages/admin/screens/users/Users";
import ManagePosts from "./pages/admin/screens/posts/ManagePosts";
import ManageExperiences from "./pages/admin/screens/experiences/ManageExperiences";
import ExperienceForm from "./pages/admin/screens/experiences/ExperienceForm.jsx";
import Comments from "./pages/admin/screens/comments/Comments";
import Reviews from "./pages/admin/screens/reviews/Reviews";

// Blog
import BlogPage from "./pages/blog/BlogPage";
import ArticleDetailPage from "./pages/articleDetail/ArticleDetailPage";
import PostFormPage from "./pages/user/screens/posts/PostFormPage.jsx";
import AboutPage from "./pages/about/AboutPage";

// Experience
import ExperiencePage from "./pages/experience/ExperiencePage";
import RegionDetail from "./pages/regionDetail/RegionDetailPage";
import ExperienceDetailPage from "./pages/experienceDetail/ExperienceDetailPage";

// User
import UserProfilePage from "./pages/profile/UserProfilePage.jsx";
import ProfilePage from "./pages/user/screens/User";
import UserNotificationsPage from "./pages/user/screens/notifications/UserNotificationPage.jsx";
import Dashboard from "./pages/user/screens/Dashboard.jsx";
import UserLayout from "./pages/user/UserLayout";
import UserManagePosts from "./pages/user/screens/posts/ManagePosts";
import UserManageExperiences from "./pages/user/screens/experiences/ManageExperiences";
import ManageFavorites from "./pages/user/screens/favorites/ManageFavorites";
import UserEditPost from "./pages/user/screens/posts/PostFormPage.jsx";
import UserEditExperience from "./pages/user/screens/experiences/EditExperience";

// Itineraries
import ManageItineraries from "./pages/user/screens/itineraries/ManageItineraries";
import CreateItinerary from "./pages/user/screens/itineraries/CreateItinerary";
import ItineraryDetailPage from "./pages/user/screens/itineraries/ItineraryDetailPage";

// Chatbot
import ChatWithBot from "./pages/user/screens/chat/ChatWithBot";

// Not found
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
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route index path="/" element={<HomePage />} />
          <Route path="/experience" element={<ExperiencePage />} />
          <Route path="/experience/:slug" element={<ExperienceDetailPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route
            path="/reset-password/:token"
            element={<ResetPasswordPage />}
          />
          {/* Blog Routes */}
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<ArticleDetailPage />} />
          <Route path="/blog/edit/:slug" element={<PostFormPage />} />
          <Route path="/blog/create" element={<PostFormPage />} />
          {/* Other Public Routes */}
          <Route path="/region/:regionName" element={<RegionDetail />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/profile/:userId" element={<UserProfilePage />} />
          {/* Footer Pages */}
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/accessibility" element={<AccessibilityPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/help" element={<HelpCenterPage />} />
          <Route path="/sitemap" element={<SiteMapPage />} />
          {/* Experience Management Routes (Public) */}
          <Route
            path="/experiences/manage/edit/:slug"
            element={<ExperienceForm />}
          />
          <Route path="/posts/manage/create" element={<PostFormPage />} />
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Admin />} />
            <Route path="import" element={<AdminImport />} />
            <Route path="comments" element={<Comments />} />
            <Route path="reviews" element={<Reviews />} />
            <Route path="posts/manage" element={<ManagePosts />} />
            <Route path="experiences/manage" element={<ManageExperiences />} />
            <Route path="posts/manage/create" element={<PostFormPage />} />
            <Route path="posts/manage/edit/:slug" element={<PostFormPage />} />
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
            <Route path="emailweb" element={<ManageEmails />} />
            <Route path="emailweb/:id" element={<EmailDetail />} />
          </Route>
          {/* User Dashboard Routes - CONSOLIDATED */}
          <Route path="/user" element={<UserLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="notifications" element={<UserNotificationsPage />} />

            {/* Post Management */}
            <Route path="posts/manage" element={<UserManagePosts />} />
            <Route path="posts/manage/create" element={<PostFormPage />} />
            <Route path="posts/manage/edit/:slug" element={<UserEditPost />} />

            {/* Experience Management */}
            <Route
              path="experiences/manage"
              element={<UserManageExperiences />}
            />
            <Route
              path="experiences/manage/create"
              element={<ExperienceForm />}
            />
            <Route
              path="experiences/manage/edit/:slug"
              element={<UserEditExperience />}
            />

            {/* Favorites */}
            <Route path="favorites/manage" element={<ManageFavorites />} />

            {/* Itineraries */}
            <Route path="itineraries/manage" element={<ManageItineraries />} />
            <Route
              path="itineraries/manage/create"
              element={<CreateItinerary />}
            />

            <Route
              path="itineraries/manage/view/:id"
              element={<ItineraryDetailPage />}
            />

            {/* Chat */}
            <Route path="chat/bot" element={<ChatWithBot />} />

            {/* Comments */}
            <Route path="comments" element={<Comments />} />
          </Route>
          {/* 404 Not Found route */}
          <Route path="/404" element={<NotFound />} /> {/* direct visit */}
          <Route path="*" element={<Navigate to={`/404`} replace />} />
        </Routes>
        <Toaster />
      </div>
    </ThemeProvider>
  );
}

export default App;
