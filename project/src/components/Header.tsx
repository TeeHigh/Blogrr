import { Link } from "react-router-dom";
import { LogIn, X, Menu } from "lucide-react";
import { useState } from "react";
import useVerifyAuth from "../hooks/authHooks/useVerifyAuth";

export default function Header() {
  const { isAuthenticated } = useVerifyAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
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

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-light transition-colors"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-secondary hover:text-secondary-light hover:underline hover:bg-slate-50 px-4 py-2 rounded-lg transition-all font-semibold"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-light transition-colors"
                >
                  <LogIn className="h-4 w-4" />
                  Get Started
                </Link>
              </>
            )}
          </nav>

          {/* Mobile toggle */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile nav */}
        {isOpen && (
          <div className="md:hidden my-3 space-y-2 text-center ">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="block bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-light"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block text-secondary hover:text-secondary-light font-semibold sm:px-4 py-2 md:py-0 bg-gray-100 active:bg-gray-200 hover:bg-gray-200 rounded-lg "
                >
                  Sign In <LogIn className="h-4 w-4 inline-flex" />
                </Link>
                <Link
                  to="/register"
                  className="block bg-primary text-white md:px-4 py-2 rounded-lg  font-semibold sm:px-4 md:py-0"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
