import { User2Icon, Mail, Lock } from "lucide-react";
import React from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../configs/api";
import { login } from "../app/features/authSlice";
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const query = new URLSearchParams(window.location.search);
  const urlState = query.get("state");
  const [state, setState] = React.useState(urlState || "login");
  const [isLoading, setIsLoading] = React.useState(false);

  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent double submission
    if (isLoading) return;

    // Basic validation
    if (!formData.email || !formData.password) {
      toast.error("Email and password are required");
      return;
    }

    if (state !== "login" && !formData.name?.trim()) {
      toast.error("Name is required for registration");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);
    try {
      const payload =
        state === "login"
          ? { email: formData.email.trim(), password: formData.password }
          : {
              name: formData.name.trim(),
              email: formData.email.trim(),
              password: formData.password,
            };

      const { data } = await api.post(`/api/users/${state}`, payload);

      // Ensure we have the required data
      if (!data?.data?.token || !data?.data?.user) {
        throw new Error("Invalid response from server");
      }

      dispatch(login(data.data));
      localStorage.setItem("token", data.data.token);

      toast.success(
        state === "login" ? "Login successful" : "Account created successfully",
      );

      // Reset form
      setFormData({ name: "", email: "", password: "" });

      // Navigate to dashboard after successful login/register
      setTimeout(() => {
        navigate("/app");
      }, 500);
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    try {
      const { data } = await api.post("/api/users/google", {
        credential: credentialResponse.credential,
      });

      if (!data?.data?.token || !data?.data?.user) {
        throw new Error("Invalid response from server");
      }

      dispatch(login(data.data));
      localStorage.setItem("token", data.data.token);

      toast.success("Google login successful!");

      setTimeout(() => {
        navigate("/app");
      }, 500);
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Google login failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    toast.error("Google login failed. Please try again.");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex items-center justify-center h-screen bg-green-50 shadow-lg">
      <form
        onSubmit={handleSubmit}
        className="sm:w-[350px] w-full text-center border border-gray-300/60 rounded-2xl px-8 bg-white"
      >
        <h1 className="text-gray-900 text-3xl mt-10 font-medium">
          {state === "login" ? "Login" : "Sign up"}
        </h1>
        <p className="text-gray-500 text-sm mt-2">Please {state} to continue</p>

        {/* Google Sign-In Button */}
        <div className="mt-6 flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap
            theme="outline"
            size="large"
            text={state === "login" ? "signin_with" : "signup_with"}
            shape="pill"
            width="300"
          />
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-gray-400 text-sm">or</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {state !== "login" && (
          <div className="flex items-center w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
            <User2Icon size={16} color="#6B7280" />
            <input
              type="text"
              name="name"
              placeholder="Name"
              className="border-none outline-none ring-0"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
        )}
        <div
          className={`flex items-center w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2 ${state !== "login" ? "mt-4" : ""}`}
        >
          <Mail size={16} color="#6B7280" />
          <input
            type="email"
            name="email"
            placeholder="Email id"
            className="border-none outline-none ring-0"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex items-center mt-4 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
          <Lock size={16} color="#6B7280" />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="border-none outline-none ring-0"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mt-4 text-left text-indigo-500">
          <button className="text-sm" type="button">
            Forget password?
          </button>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 w-full h-11 rounded-full text-white bg-green-500 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading
            ? "Please wait..."
            : state === "login"
              ? "Login"
              : "Sign up"}
        </button>
        <p
          onClick={() => {
            setState((prev) => (prev === "login" ? "register" : "login"));
            setFormData({ name: "", email: "", password: "" });
          }}
          className="text-gray-500 text-sm mt-3 mb-11 cursor-pointer"
        >
          {state === "login"
            ? "Don't have an account?"
            : "Already have an account?"}{" "}
          <span className="text-indigo-500 hover:underline">click here</span>
        </p>
      </form>
    </div>
  );
};

export default Login;
