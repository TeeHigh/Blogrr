import React, { Suspense, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "@mantine/core/styles.css";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { MantineProvider } from "@mantine/core";

const HomePage = React.lazy(() => import("./pages/HomePage"));
const BlogPost = React.lazy(() => import("./pages/BlogPost"));
const Login = React.lazy(() => import("./pages/Login"));
const Register = React.lazy(() => import("./pages/Register"));
const EmailVerification = React.lazy(() => import("./pages/EmailVerification"));
const Onboarding = React.lazy(() => import("./pages/Onboarding"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));

import AuthProvider, { useAuth } from "./contexts/AuthContext";
import { BlogProvider } from "./contexts/BlogContext";
import { Toaster } from "react-hot-toast";
import OverlayLoader from "./components/OverlayLoader";
import { ModalsProvider } from "@mantine/modals";
import { OnboardingProvider } from "./contexts/OnboardingContext";
import { AvatarProvider } from "./contexts/AvatarContext";
import ProtectedRoute from "./components/ProtectedRoute";
import CSRFToken from "./components/CSRFToken";
import { SettingsProvider } from "./contexts/SettingsContext";

function AppRouter() {
  return (
    <Router>
      <Suspense fallback={<OverlayLoader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<EmailVerification />} />
          <Route path="/onboarding" element={<Onboarding />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard/*" element={<Dashboard />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider>
        <ModalsProvider>
          <AuthProvider>
            <BlogProvider>
              <SettingsProvider>
                <AvatarProvider>
                  <OnboardingProvider>
                    <Toaster position="top-center" />
                    {/* <CSRFToken />  */}
                    <AppRouter />
                  </OnboardingProvider>
                </AvatarProvider>
              </SettingsProvider>
            </BlogProvider>
          </AuthProvider>
        </ModalsProvider>
        <ReactQueryDevtools initialIsOpen={true} />
      </MantineProvider>
    </QueryClientProvider>
  );
}

export default App;
