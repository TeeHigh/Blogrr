import React, { useState } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";
import { FcGoogle } from "react-icons/fc";
import { Github } from "lucide-react";
import useCheckEmailAvailability from "../hooks/authHooks/useCheckEmailAvailability";
import toast from "react-hot-toast";

export default function Register() {
  const [formData, setFormData] = useState({
    email: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const { isPending, isError, checkEmailAvailability } =
    useCheckEmailAvailability();
  const navigate = useNavigate();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(isPending);
    if (!validateForm()) return;

    checkEmailAvailability(formData.email);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-between auth-page-background">
      {/* left side */}
      <div className="hidden lg:flex lg:flex-col items-center justify-center bg-[url('/assets/gradient-bg.jpg')] bg-no-repeat bg-center py-8 px-9 rounded-tr-3xl rounded-br-3xl shadow-lg text-white text-center text-xl leading-loose h-screen w-1/2 ">
        <h2 className="join-title">Join Us!</h2>
        <p className="login-description">
          <span className="highlighted">Create an account</span> to start
          sharing your thoughts, connect with others, and{" "}
          <span className="highlighted">explore</span> a world of ideas.
        </p>
        <p className="login-description">
          <span className="highlighted">Join our community</span> of writers and
          readers today!
        </p>
      </div>

      {/* right side */}
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
            Create your account
          </h1>
          <p className="text-gray-600">
            Join our community of writers and creators
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg border p-8 mx-auto">
          <div className="space-y-4">
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-3 hover:bg-gray-50 transition-colors"
              onClick={() =>
                toast("Google sign in not implemented yet", {
                  icon: <FcGoogle className="h-5 w-5" />,
                  id: "google-signin",
                })
              }
            >
              <FcGoogle className="h-5 w-5" />
              <span className="text-sm font-medium text-gray-700">
                Continue with Google
              </span>
            </button>

            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-3 hover:bg-gray-50 transition-colors"
              onClick={() =>
                toast("GitHub sign in not implemented yet", {
                  icon: <Github className="h-5 w-5 text-gray-700" />,
                  id: "github-signin",
                })
              }
            >
              <Github className="h-5 w-5 text-gray-700" />
              <span className="text-sm font-medium text-gray-700">
                Continue with GitHub
              </span>
            </button>
          </div>

          <div className="flex items-center my-6">
            <hr className="flex-grow border-t border-gray-300" />
            <span className="mx-4 text-gray-400 text-sm">or</span>
            <hr className="flex-grow border-t border-gray-300" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`mt-1 block w-full px-4 py-2 border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary-light focus:border-transparent text-base`}
                placeholder="you@example.com"
              />
              {isError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center mt-2">
                  <p className="text-cancel text-sm">
                    {errors.email || "Something went wrong!"}
                  </p>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-secondary-light text-white py-2 px-4 rounded-lg hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Checking..." : "Continue"}
            </button>

            {/* Submission Error */}
            {errors.submit && (
              <p className="text-red-500 text-sm text-center mt-2">
                {errors.submit}
              </p>
            )}
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-700 hover:underline font-medium"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
