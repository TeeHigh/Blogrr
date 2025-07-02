import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastContainer } from "react-toastify";

import "./styles/styles.scss";

import Home from "./pages/Home";
import BlogPost from "./pages/BlogPost";
import LoginOrRegister from "./pages/LoginOrRegister";
import Dashboard from "./pages/Dashboard";
import BlogFormPage from "./pages/BlogFormPage";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";
import AuthRoute from "./components/AuthRoute";
import Footer from "./components/Footer";

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<div className="container"><Home /></div>} />
            <Route path="/post/:id" element={<BlogPost />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <div className="container">
                    <Dashboard />
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit/:id"
              element={
                <ProtectedRoute>
                  <BlogFormPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/login"
              element={
                <AuthRoute>
                  <LoginOrRegister mode="login" route="/api/token/" />
                </AuthRoute>
              }
            />
            <Route
              path="/register"
              element={
                <AuthRoute>
                  <LoginOrRegister mode="register" route="/api/user/register/" />
                </AuthRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
          {/* Footer Section */}
          {/* <Footer /> */}
          <ToastContainer
            position="top-right"
            pauseOnHover={false}
            pauseOnFocusLoss={false}
          />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
