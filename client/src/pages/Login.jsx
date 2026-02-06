import { User2Icon, Mail, Lock } from "lucide-react";
import React from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../configs/api";
import { login } from "../app/features/authSlice";
import { GoogleLogin } from "@react-oauth/google";
import { isValidEmail, stripNumbers } from "../utils/validation";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const query = new URLSearchParams(window.location.search);
  const urlState = query.get("state");
  const [state, setState] = React.useState(urlState || "login");
  const [isLoading, setIsLoading] = React.useState(false);
  const [errors, setErrors] = React.useState({});
  const [touched, setTouched] = React.useState({});

  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
  });

  // Validate a single field
  const validateField = (name, value) => {
    switch (name) {
      case "name":
        if (!value?.trim()) return "Name is required";
        if (value.trim().length < 2)
          return "Name must be at least 2 characters";
        return "";
      case "email":
        if (!value?.trim()) return "Email is required";
        if (!isValidEmail(value)) return "Please enter a valid email";
        return "";
      case "password":
        if (!value) return "Password is required";
        if (value.length < 6) return "Password must be at least 6 characters";
        return "";
      default:
        return "";
    }
  };

  // Validate all fields
  const validateForm = () => {
    const newErrors = {};
    if (state !== "login") {
      newErrors.name = validateField("name", formData.name);
    }
    newErrors.email = validateField("email", formData.email);
    newErrors.password = validateField("password", formData.password);

    // Filter out empty errors
    const filteredErrors = Object.fromEntries(
      Object.entries(newErrors).filter(([_, v]) => v),
    );
    setErrors(filteredErrors);
    return Object.keys(filteredErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent double submission
    if (isLoading) return;

    // Validate all fields
    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
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

    // Filter name field to prevent numbers
    let filteredValue = value;
    if (name === "name") {
      filteredValue = stripNumbers(value);
    }

    setFormData((prev) => ({ ...prev, [name]: filteredValue }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    if (error) {
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  // Helper for input styling
  const getInputClassName = (fieldName, baseClass) => {
    const hasError = touched[fieldName] && errors[fieldName];
    return `${baseClass} ${hasError ? "border-red-500 ring-1 ring-red-500" : ""}`;
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
          <div className="mt-4">
            <div
              className={`flex items-center w-full bg-white border h-12 rounded-full overflow-hidden pl-6 gap-2 ${touched.name && errors.name ? "border-red-500" : "border-gray-300/80"}`}
            >
              <User2Icon
                size={16}
                color={touched.name && errors.name ? "#EF4444" : "#6B7280"}
              />
              <input
                type="text"
                name="name"
                placeholder="Name"
                className="border-none outline-none ring-0 flex-1"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
            {touched.name && errors.name && (
              <p className="text-red-500 text-xs mt-1 text-left pl-6">
                {errors.name}
              </p>
            )}
          </div>
        )}
        <div className={`mt-4`}>
          <div
            className={`flex items-center w-full bg-white border h-12 rounded-full overflow-hidden pl-6 gap-2 ${touched.email && errors.email ? "border-red-500" : "border-gray-300/80"}`}
          >
            <Mail
              size={16}
              color={touched.email && errors.email ? "#EF4444" : "#6B7280"}
            />
            <input
              type="email"
              name="email"
              placeholder="Email id"
              className="border-none outline-none ring-0 flex-1"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
          {touched.email && errors.email && (
            <p className="text-red-500 text-xs mt-1 text-left pl-6">
              {errors.email}
            </p>
          )}
        </div>
        <div className="mt-4">
          <div
            className={`flex items-center w-full bg-white border h-12 rounded-full overflow-hidden pl-6 gap-2 ${touched.password && errors.password ? "border-red-500" : "border-gray-300/80"}`}
          >
            <Lock
              size={16}
              color={
                touched.password && errors.password ? "#EF4444" : "#6B7280"
              }
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="border-none outline-none ring-0 flex-1"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
          {touched.password && errors.password && (
            <p className="text-red-500 text-xs mt-1 text-left pl-6">
              {errors.password}
            </p>
          )}
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
