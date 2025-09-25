import Sidebar from "../../components/Sidebar";

export default function Dashboard() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <p>Welcome to your admin dashboard. Select a menu item to manage content.</p>
      </div>
    </div>
  );
}
