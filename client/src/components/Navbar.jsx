import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../app/features/authSlice";
import { LogOut, LayoutDashboard } from "lucide-react";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutUser = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <nav className="flex justify-between items-center max-w-7xl mx-auto px-4 sm:px-6 h-16 transition-all">
        <Link to="/" className="flex items-center gap-2" aria-label="Home">
          <img src="/logo.svg" alt="" className="h-9 w-auto" />
        </Link>

        <div className="flex items-center gap-6">
          {user && (
            <>
              <p className="hidden sm:block text-sm font-medium text-slate-600">
                Hi, {user.name}
              </p>
              <Link
                to="/app"
                className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-green-600 transition-colors"
              >
                <LayoutDashboard size={18} />
                <span className="hidden xs:block">Dashboard</span>
              </Link>
              <button
                onClick={logoutUser}
                className="flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700 transition-colors"
                aria-label="Logout"
              >
                <LogOut size={18} />
                <span className="hidden xs:block">Logout</span>
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
