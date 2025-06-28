import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastContainer } from 'react-toastify';

import "./styles/styles.scss";

import Home from "./pages/Home";
import BlogPost from "./pages/BlogPost";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NewEditBlog from "./components/NewEditBlog";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import AuthRoute from "./components/AuthRoute";
import Footer from "./components/Footer";

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/post/:id" element={<BlogPost />} />
              <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
              <Route path="/register" element={<AuthRoute><Register /></AuthRoute>} />
              {/* Protected Route for Dashboard */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              {/* Protected Route for NewsBlog Edit */}
              <Route
                path="/edit/:id"
                element={
                  <ProtectedRoute>
                    <NewEditBlog />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Router>
        {/* Footer Section */}
      <Footer/>
        <ToastContainer position="top-right" pauseOnHover={false} pauseOnFocusLoss={false} />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
