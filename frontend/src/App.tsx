import { Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Landing from "./pages/index";
import DashboardPage from "./pages/pages";
import TaskDetailPage from "./pages/TaskDetailPage";
import { useAuth } from "./context/AuthContext";
import NotificationPanel from "./components/NotificationPanel";

export default function App() {
  const { user,accessToken } = useAuth();
  
  return (
    <div className="min-h-screen">
      <Navbar />
      <NotificationPanel />
      <main className="mx-auto max-w-6xl p-4">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route
            path="/dashboard"
            element={user ? <DashboardPage /> : <Navigate to="/" replace />}
          />
          <Route
            path="/tasks/:id"
            element={user ? <TaskDetailPage /> : <Navigate to="/" replace />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}