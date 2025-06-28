import React, { useState } from "react";
import "../styles/AuthForm.scss";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../contexts/AuthContext";
import { HiEye, HiEyeSlash, HiXCircle } from "react-icons/hi2";
import { toast } from "react-toastify";

const AuthForm = ({ route, mode }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const { setIsAuthorized } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    setIsLoading(true);
    setErrorMsg("");
    e.preventDefault();

    try {
      const response = await api.post(route, {
        username: formData.username,
        password: formData.password,
        ...(mode === "register" && { email: formData.email }),
      });

      if (mode === "login") {
        localStorage.setItem("access_token", response.data.access);
        localStorage.setItem("refresh_token", response.data.refresh);
        setIsAuthorized(true);
        toast.success("Login successful!")
        navigate("/dashboard");
      } else {
        toast.success("Registration successful! Please login.");
        navigate("/login");
      }
    } catch (error) {
      let msg = "An error occurred. Please try again.";
      if (error.response && error.response.data) {
        if (typeof error.response.data === "string") {
          msg = error.response.data;
        } else if (typeof error.response.data === "object") {
          msg = Object.values(error.response.data).flat().join(" ");
        }
      }
      setErrorMsg(msg);
      console.error("Error during authentication:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <span className="close-form" onClick={() => navigate("/")}>
          <HiXCircle />
        </span>
        <h1>{mode === "login" ? "Login" : "Register"}</h1>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="auth-input"
          required
        />
        {mode === "register" && (
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="auth-input"
            required
            />
          )}
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="auth-input"
          required
          />
        <span
          className="toggle-password-visibility"
          style={{ cursor: "pointer", marginLeft: "-30px", userSelect: "none" }}
          onClick={() => setShowPassword((prev) => !prev)}
          title={showPassword ? "Hide password" : "Show password"}
          >
          {showPassword ? <HiEyeSlash /> : <HiEye />}
        </span>
          {errorMsg && <div className="auth-error">{errorMsg}</div>}
        <button type="submit" className="auth-button" disabled={isLoading}>
          {isLoading ? "Loading..." : mode === "login" ? "Login" : "Register"}
        </button>
        <p className="toggle-text">
          {mode === "login" ? (
            <>
              Don't have an account? <Link to="/register">Register</Link>
            </>
          ) : (
            <>
              Already have an account? <Link to="/login">Login</Link>
            </>
          )}
        </p>
      </form>
    </div>
  );
};

export default AuthForm;
