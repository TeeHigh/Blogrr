// import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import BlogPost from "./pages/BlogPost";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EmailVerification from "./pages/EmailVerification";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import AuthProvider, { useAuth } from "./contexts/AuthContext";
import { BlogProvider } from "./contexts/BlogContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/blog/:id" element={<BlogPost />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<EmailVerification />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

const queryClient = new QueryClient();

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BlogProvider>
          <AppRouter />
        </BlogProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
