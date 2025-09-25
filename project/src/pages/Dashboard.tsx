import { Suspense, lazy, useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Sidebar from "../components/dashboard/Sidebar";
import { Menu } from "lucide-react";;
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import { useBlogContext } from "../contexts/BlogContext";
import OverlayLoader from "../components/OverlayLoader";
import useUser from "../hooks/dashboardHooks/useUser";
import { clear } from "console";

// Lazy-loaded components
const DashboardOverview = lazy(
  () => import("../components/dashboard/DashboardOverview")
);
const BlogManagement = lazy(
  () => import("../components/dashboard/BlogManagement")
);
const PostEditor = lazy(() => import("../components/dashboard/PostEditor"));
const Chat = lazy(() => import("../components/dashboard/Chat"));
const Settings = lazy(() => import("../components/dashboard/Settings"));

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const { setUser } = useAuth();
  const { setAuthorPosts} = useBlogContext();

  const { data: userData, isPending: isFetchingDashData } = useUser();

  // Fetch user data on mount
  useEffect(() => {
  const init = async () => {
    if (isFetchingDashData) return;

    const toastId = toast.loading("Fetching dashboard");
    
    try {
      setUser(userData.author);
      setAuthorPosts(userData.blogs);
      toast.success("Dashboard loaded", { id: toastId });
    } catch (error) {
      toast.error("Session expired. Please log in again.", { id: toastId });
      console.error(error);
    } finally {
      toast.dismiss(toastId);
    }
  };

  init();
}, [userData]);


  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between lg:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900 lg:hidden">
            Dashboard
          </h1>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
          <Suspense fallback={<OverlayLoader />}>
            <Routes>
              <Route path="/" element={<DashboardOverview />} />
              <Route path="/posts" element={<BlogManagement />} />
              <Route path="/edit/:id" element={<PostEditor mode="edit" />} />
              <Route path="/create" element={<PostEditor />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </div>
  );
}
