import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ResumeBuilder from "./pages/ResumeBuilder";
import Preview from "./pages/Preview";
import { Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import api from "../src/configs/api";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { login, logout, setLoading } from "./app/features/authSlice";
import { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";

function App() {
  const dispatch = useDispatch();

  const getUserData = async () => {
    const token = localStorage.getItem("token");

    // If no token, stop loading immediately
    if (!token) {
      dispatch(setLoading(false));
      return;
    }

    try {
      const { data } = await api.get("/api/users/data", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Validate response structure
      if (data?.data?.user) {
        dispatch(login({ token, user: data.data.user }));
      } else {
        // Invalid response structure, clear token
        localStorage.removeItem("token");
        console.error("Invalid user data structure received");
      }
    } catch (error) {
      // On error, clear invalid token and logout
      console.error("Session validation failed:", error.message);
      localStorage.removeItem("token");
      dispatch(logout());
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="app" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="builder/:resumeId" element={<ResumeBuilder />} />
        </Route>

        <Route path="view/:resumeId" element={<Preview />} />
        <Route path="login" element={<Login />} />
      </Routes>
    </GoogleOAuthProvider>
  );
}

export default App;
