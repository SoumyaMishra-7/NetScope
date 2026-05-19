import { lazy, Suspense } from "react";
import { AnimatePresence } from "framer-motion";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import AppLayout from "./layouts/AppLayout.jsx";
import LoaderSkeleton from "./components/LoaderSkeleton.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";

const Login = lazy(() => import("./pages/Login.jsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));
const Analytics = lazy(() => import("./pages/Analytics.jsx"));
const PacketViewer = lazy(() => import("./pages/PacketViewer.jsx"));
const UploadLogs = lazy(() => import("./pages/UploadLogs.jsx"));
const Settings = lazy(() => import("./pages/Settings.jsx"));

export default function App() {
  const location = useLocation();

  return (
    <Suspense fallback={<div className="p-6"><LoaderSkeleton rows={6} /></div>}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="packet/:id" element={<PacketViewer />} />
            <Route path="upload" element={<UploadLogs />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}
