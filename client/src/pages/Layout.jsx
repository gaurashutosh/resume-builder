import { Navigate, Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import { Loader } from "lucide-react";
import Login from "./Login";
const Layout = () => {
  const { user, loading } = useSelector((state) => state.auth);

  // Show loading spinner while validating session
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <Loader className="size-8 animate-spin text-green-600" />
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  // Show protected content if user is authenticated, otherwise show login
  return (
    <div>
      {user ? (
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Outlet />
        </div>
      ) : (
        <Login />
      )}
    </div>
  );
};

export default Layout;
