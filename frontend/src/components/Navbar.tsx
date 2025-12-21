import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";



export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="bg-white border-b">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link to="/dashboard" className="font-bold text-blue-600">TaskManager</Link>
        <div className="flex items-center gap-4">
          {user? (
            <>
              <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">Dashboard</Link>
              <span className="text-sm text-gray-600">{user.name}</span>
              <button
                onClick={handleLogout}
                className="rounded bg-blue-600 px-3 py-1.5 text-white hover:bg-blue-700"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/" className="rounded bg-blue-600 px-3 py-1.5 text-white hover:bg-blue-700">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}