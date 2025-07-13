import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';
import DashboardOverview from '../components/dashboard/DashboardOverview';
import BlogManagement from '../components/dashboard/BlogManagement';
import CreatePost from '../components/dashboard/CreatePost';
import Chat from '../components/dashboard/Chat';
import { Menu } from 'lucide-react';

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      <div className={`${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
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
          <h1 className="text-xl font-semibold text-gray-900 lg:hidden">Dashboard</h1>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
          <Routes>
            <Route path="/" element={<DashboardOverview />} />
            <Route path="/posts" element={<BlogManagement />} />
            <Route path="/create" element={<CreatePost />} />
            <Route path="/chat" element={<Chat />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}