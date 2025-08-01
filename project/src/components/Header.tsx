import { Link } from "react-router-dom";
import { PenTool, LogIn } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function Header() {
  const { user } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-bold text-gray-900"
          >
            <img
              src="/assets/logos/BlueOnTransparent.png"
              className="w-32"
              alt="Blogrr Logo"
            />
          </Link>

          <nav className="flex items-center gap-6">
            {/* <Link
              to="/"
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Home
            </Link> */}
            {user ? (
              <Link
                to="/dashboard"
                className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-light transition-colors"
              >
                Dashboard
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-secondary hover:text-secondary-light font-semibold"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-2 bg-primary text-white px-2 md:px-4 py-2 rounded-lg font-normal md:font-medium hover:bg-primary-light transition-colors"
                >
                  <LogIn className="h-4 w-4" />
                  Get Started
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
