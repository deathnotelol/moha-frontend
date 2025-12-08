import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import axios from "../../api/axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LabelList,
  Cell
} from "recharts";

// Month color mapping
const monthColors = [
  "#EF4444", "#F59E0B", "#FBBF24", "#10B981",
  "#3B82F6", "#6366F1", "#8B5CF6", "#EC4899",
  "#F43F5E", "#06B6D4", "#84CC16", "#A3E635"
];

export default function Dashboard() {
  const [stats, setStats] = useState({ posts: 0, categories: 0, users: 0 });
  const [latestPosts, setLatestPosts] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, postsRes, chartRes] = await Promise.all([
          axios.get("/v1/dashboard/stats"),
          axios.get("/v1/dashboard/latest-posts"),
          axios.get("/v1/dashboard/posts-chart"),
        ]);

        // Filter last N years (5 years)
        const currentYear = new Date().getFullYear();
        const yearsToShow = 5;

        const filteredChartData = chartRes.data
          .filter(item => {
            // item.month format: "Jan 2025"
            const itemYear = parseInt(item.month.split(" ")[1], 10);
            return itemYear >= currentYear - yearsToShow + 1;
          })
          .sort((a, b) => {
            // Latest month first
            const [monthA, yearA] = a.month.split(" ");
            const [monthB, yearB] = b.month.split(" ");
            const dateA = new Date(`${monthA} 1, ${yearA}`);
            const dateB = new Date(`${monthB} 1, ${yearB}`);
            return dateB - dateA;
          });

        // Assign colors
        const chartWithColors = filteredChartData.map((item, index) => ({
          ...item,
          color: monthColors[index % 12]
        }));

        setStats(statsRes.data);
        setLatestPosts(postsRes.data);
        setChartData(chartWithColors);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Dashboard</h1>

        {loading ? (
          <p className="text-gray-500">Loading dashboard data...</p>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-6 rounded-xl shadow-lg flex flex-col items-center transition-transform hover:scale-105">
                <span className="text-sm">Posts</span>
                <span className="text-3xl font-bold">{stats.posts}</span>
              </div>
              <div className="bg-gradient-to-r from-green-400 to-teal-500 text-white p-6 rounded-xl shadow-lg flex flex-col items-center transition-transform hover:scale-105">
                <span className="text-sm">Categories</span>
                <span className="text-3xl font-bold">{stats.categories}</span>
              </div>
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-xl shadow-lg flex flex-col items-center transition-transform hover:scale-105">
                <span className="text-sm">Users</span>
                <span className="text-3xl font-bold">{stats.users}</span>
              </div>
            </div>

            {/* Posts Chart */}
            <div className="bg-white p-6 rounded-xl shadow mb-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Posts per Month (Last 5 Years)</h2>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="posts">
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                    <LabelList dataKey="posts" position="top" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          
          {/* Latest Posts */}
            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Latest Posts</h2>
              <div className="overflow-x-auto">
                <table className="w-full table-auto text-gray-700">
                  <thead>
                    <tr className="bg-gray-100 uppercase text-sm text-gray-600">
                      <th className="p-3 text-left">Title</th>
                      <th className="p-3 text-left">Category</th>
                      <th className="p-3 text-left">Created At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {latestPosts.map((post, idx) => (
                      <tr
                        key={post.id}
                        className={`border-b transition ${
                          idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                        } hover:bg-blue-50`}
                      >
                        <td className="p-3 font-medium">{post.title}</td>
                        <td className="p-3">{post.category}</td>
                        <td className="p-3">{new Date(post.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </>
        )}
      </div>
    </div>
  );
}
