import React, { useState } from "react";
import { Navigate, useLocation, Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import useLogin from "../hooks/useLogin";
import { useAuth } from "../contexts/AuthContext";
import { AxiosError } from "axios";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);


  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { login, isPending, isError, error } = useLogin();

  const from = location.state?.from?.pathname || "/dashboard";

  if (user) {
    return <Navigate to={from} replace />;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(formData);
    } catch (err: AxiosError | any) {
      console.error(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-between auth-page-background">
      <div className="max-w-md w-full p-6 mx-auto">

        <div className="text-center mb-8">
          <img
            src="/assets/logos/BlueOnTransparent.png"
            alt="Logo"
            className="login-logo w-48 mx-auto mb-4 cursor-pointer"
            onClick={() => navigate("/")}
          />

        </div>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            Welcome back!
          </h1>
          <p className="text-gray-600">
            Please enter your credentials to access your account.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border p-8">
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  name="email"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-light focus:border-transparent outline-none"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  name="password"
                  onChange={handleChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-light focus:border-transparent outline-none"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 p-1 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            <button type="button" className="hover:underline text-primary-light hover:text-primary text-[0.75rem]">Forgot password?</button>
            </div>

            {isError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{"Login failed"}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-secondary text-white py-3 px-4 rounded-lg font-semibold hover:bg-secondary-light focus:ring-2 focus:bg-secondary focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Signing in..." : "Sign in"}
            </button>
          </form>

          

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-blue-600 hover:text-blue-700 hover:underline font-medium"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right side  */}
      <div className="hidden lg:flex lg:flex-col items-center justify-center bg-[url('/assets/gradient-bg.jpg')] bg-no-repeat bg-center py-8 px-9 rounded-tl-3xl rounded-bl-3xl shadow-lg text-white text-center text-xl leading-loose h-screen w-1/2 ">
        <h2 className="welcome-title">Ready to dive in?</h2>
        <p className="login-description">
          Sign in to access your personalized dashboard{" "}
          <span className="highlighted">manage your blogs,</span> and connect
          with the community.
        </p>
        <p className="login-description">
          Enjoy a <span className="highlighted">seamless writing</span> and{" "}
          <span className="highlighted">reading experience</span> with our
          modern platform.
        </p>
      </div>
    </div>
  );
}
