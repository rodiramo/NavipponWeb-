import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { getUserCount } from "../../../services/index/users";
import {
  getExperienceCount,
  getTopExperiences,
} from "../../../services/index/experiences";
import { getReviewCount } from "../../../services/index/reviews";
import { getPostCount } from "../../../services/index/posts";
import { getCommentCount } from "../../../services/index/comments";
import { getFavoritesCount } from "../../../services/index/favorites";
import useUser from "../../../hooks/useUser";
import { Typography } from "@mui/material";

const Admin = () => {
  const { jwt } = useUser();
  const [counts, setCounts] = useState({
    users: 0,
    experiences: 0,
    reviews: 0,
    posts: 0,
    comments: 0,
  });
  const [topExperiences, setTopExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [
          usersCount,
          experiencesCount,
          reviewsCount,
          postsCount,
          commentsCount,
          topExperiencesData,
        ] = await Promise.all([
          getUserCount(jwt),
          getExperienceCount(jwt),
          getReviewCount(jwt),
          getPostCount(jwt),
          getCommentCount(jwt),
          getTopExperiences(),
        ]);

        const experiencesWithFavorites = await Promise.all(
          topExperiencesData.map(async (experience) => {
            if (typeof experience.favoritesCount !== "undefined") return experience;
            const favoritesData = await getFavoritesCount(experience._id);
            return {
              ...experience,
              favoritesCount: favoritesData.favoritesCount,
            };
          })
        );

        setCounts({
          users: usersCount,
          experiences: experiencesCount,
          reviews: reviewsCount,
          posts: postsCount,
          comments: commentsCount,
        });
        setTopExperiences(experiencesWithFavorites);
      } catch (error) {
        console.error("Error fetching counts", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [jwt]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-xl text-gray-600 flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span>Loading dashboard...</span>
        </div>
      </div>
    );
  }

  // Calcular totales para los gráficos
  const totalContent =
    counts.experiences + counts.reviews + counts.posts + counts.comments;

  const contentData = [
    {
      name: "Reviews",
      value: counts.reviews,
      color: "#F59E0B",
      percentage: totalContent ? ((counts.reviews / totalContent) * 100).toFixed(1) : 0,
    },
    {
      name: "Comments",
      value: counts.comments,
      color: "#EF4444",
      percentage: totalContent ? ((counts.comments / totalContent) * 100).toFixed(1) : 0,
    },
    {
      name: "Posts",
      value: counts.posts,
      color: "#8B5CF6",
      percentage: totalContent ? ((counts.posts / totalContent) * 100).toFixed(1) : 0,
    },
    {
      name: "Experiences",
      value: counts.experiences,
      color: "#10B981",
      percentage: totalContent ? ((counts.experiences / totalContent) * 100).toFixed(1) : 0,
    },
  ];

  const experienceData = topExperiences.map((exp, index) => ({
    name: exp.title.length > 20 ? exp.title.substring(0, 20) + "..." : exp.title,
    favorites: exp.favoritesCount,
    rank: index + 1,
  }));

  // Puedes traer datos reales de tendencias si los tienes, aquí es mock:
  const trendData = [
    { month: "Jan", users: 980, experiences: 280, reviews: 1200 },
    { month: "Feb", users: 1050, experiences: 295, reviews: 1350 },
    { month: "Mar", users: 1120, experiences: 315, reviews: 1520 },
    { month: "Apr", users: 1180, experiences: 325, reviews: 1680 },
    { month: "May", users: counts.users, experiences: counts.experiences, reviews: counts.reviews },
  ];

  // Calcular crecimiento (mock)
  const userGrowth = (((counts.users - 980) / 980) * 100).toFixed(1);
  const expGrowth = (((counts.experiences - 280) / 280) * 100).toFixed(1);
  const reviewGrowth = (((counts.reviews - 1200) / 1200) * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600">
            Platform performance and user engagement metrics
          </p>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
              </div>
              <span className="text-green-500 text-sm font-semibold">
                +{userGrowth}%
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-1">
              Total Users
            </h3>
            <p className="text-3xl font-bold text-blue-600">
              {counts.users.toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
              </div>
              <span className="text-green-500 text-sm font-semibold">
                +{expGrowth}%
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-1">
              Experiences
            </h3>
            <p className="text-3xl font-bold text-green-600">
              {counts.experiences}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-yellow-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <span className="text-green-500 text-sm font-semibold">
                +{reviewGrowth}%
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-1">
              Reviews
            </h3>
            <p className="text-3xl font-bold text-yellow-600">
              {counts.reviews.toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-blue-500 text-sm font-semibold">
                {counts.posts > 0
                  ? ((counts.comments / counts.posts) * 100).toFixed(0)
                  : 0}
                % ratio
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-1">
              Engagement
            </h3>
            <p className="text-3xl font-bold text-purple-600">
              {(counts.comments + counts.posts).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Content Distribution Pie Chart */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Content Distribution
            </h2>
            <div className="flex flex-col items-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={contentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {contentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    formatter={(value, name) => [
                      `${value.toLocaleString()}`,
                      name,
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-4 mt-4 w-full">
                {contentData.map((item) => (
                  <div key={item.name} className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-700">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.percentage}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Growth Trends */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Growth Trends
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="#3B82F6"
                  fill="url(#userGradient)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Experiences Bar Chart */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Top Experiences by Favorites
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={experienceData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="name"
                stroke="#6b7280"
                angle={-45}
                textAnchor="end"
                height={100}
                interval={0}
              />
              <YAxis stroke="#6b7280" />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Bar dataKey="favorites" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>

          {/* Percentage breakdown */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-4">
            {topExperiences.map((exp, index) => {
              const totalFavorites = topExperiences.reduce(
                (sum, e) => sum + e.favoritesCount,
                0
              );
              const percentage = totalFavorites
                ? ((exp.favoritesCount / totalFavorites) * 100).toFixed(1)
                : 0;
              return (
                <div
                  key={exp._id}
                  className="bg-gray-50 rounded-lg p-4 text-center"
                >
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {percentage}%
                  </div>
                  <div className="text-xs text-gray-600 leading-tight">
                    {exp.title}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {exp.favoritesCount} favorites
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;