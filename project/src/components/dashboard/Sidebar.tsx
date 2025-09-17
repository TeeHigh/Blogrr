
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  FileText, 
  PlusCircle, 
  MessageCircle, 
  Settings, 
  LogOut, 
  X
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { defaultAvatar } from '../../constants/defaultAvatar';
import useLogout from '../../hooks/authHooks/useLogout';

interface SidebarProps {
  onClose: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const { user } = useAuth();
  const { logout } = useLogout();
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { name: 'Overview', href: '/dashboard', icon: Home },
    { name: 'My Posts', href: '/dashboard/posts', icon: FileText },
    { name: 'Create Post', href: '/dashboard/create', icon: PlusCircle },
    { name: 'Collaboration', href: '/dashboard/chat', icon: MessageCircle },
  ];

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <Link to="/" className="">
          <img
            src="/assets/logos/BlueOnTransparent.png"
            alt="Blogrr Logo"
            className="w-32  cursor-pointer"
            onClick={() => navigate("/")}
          />
        </Link>
        <button 
          onClick={onClose}
          className="p-1 rounded-lg text-gray-400 hover:text-gray-600 lg:hidden"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* User info */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <img
            src={user?.avatar?.url || defaultAvatar}
            alt={user?.fullname}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold text-gray-900">{user?.fullname}</p>
            <p className="text-sm text-gray-500 capitalize">{user?.role || "author"}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <Link 
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 w-full transition-colors mb-2"
          to={'/dashboard/settings'}
          onClick={onClose}
        >
          <Settings className="h-5 w-5" />
          Settings
        </Link>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 w-full transition-colors"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
}