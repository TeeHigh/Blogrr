import {
  AlertTriangle,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

import useDeleteAccount from "../../hooks/accountHooks/useDeleteAccount";

import Security from "../settings/Security";
import Notifications from "../settings/Notifications";
import Privacy from "../settings/Privacy";
import Account from "../settings/Account";
import { useSettings } from "../../contexts/SettingsContext";
import Profile from "../settings/Profile";

const SAMPLE_AVATARS = [
  "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150",
  "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150",
  "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150",
  "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150",
  "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150",
  "https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=150",
];

export default function Settings() {
  const { user } = useAuth();

  const {
    tabs,
    activeTab, 
    setActiveTab,
  } = useSettings();

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        if (!user) return <p>Loading...</p>;
        return <Profile />;

      case "security":
        return <Security />;

      case "notifications":
        return <Notifications />;

      case "privacy":
        return <Privacy />;

      case "account":
        return <Account />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-6 relative">
        <div className="mb-8">
          {/* <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </button> */}
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <nav className="bg-white rounded-lg shadow-sm border p-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm border p-8">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>

      
    </div>
  );
}
