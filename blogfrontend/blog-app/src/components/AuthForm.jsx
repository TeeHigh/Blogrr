import React, { useState } from "react";
import "../styles/AuthForm.scss";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../contexts/AuthContext";
import {
  HiEye,
  HiEyeSlash,
  HiOutlineXCircle,
  HiXCircle,
  HiOutlineCheckCircle
} from "react-icons/hi2";
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
  const [usernameStatus, setUsernameStatus] = useState(null);

  const checkUsernameAvailability = async (username) => {
    try {
      const res = await api.get(`/api/check-username/`, {
        params: { username },
      });
      setUsernameStatus(res.data.exists ? "taken" : "available");
    } catch (error) {
      console.error("Username check failed:", error);
    }
  };

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
        username: formData.username.toLowerCase(),
        password: formData.password,
        ...(mode === "register" && { email: formData.email }),
      });

      if (mode === "login") {
        localStorage.setItem("access_token", response.data.access);
        localStorage.setItem("refresh_token", response.data.refresh);
        setIsAuthorized(true);
        toast.success("Login successful!");
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
        <div className="form-title">
          <h1>{mode === "login" ? "Login" : "Sign Up"}</h1>
          <span className="close-form" onClick={() => navigate("/")}>
            <HiXCircle />
          </span>
        </div>
        <div className="inputs">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={(e) => {
              handleChange(e);
              setUsernameStatus(null); // reset while typing
            }}
            onBlur={() =>
              mode === "register" &&
              checkUsernameAvailability(formData.username)
            }
            className={`auth-input ${
              usernameStatus === "taken" ? "input-error" : ""
            }`}
            autoComplete="off"
            autoFocus
            required
          />
          {mode === "register" && usernameStatus === "taken" && (
            <p className="username-error">
              {" "}
              <HiOutlineXCircle />
              Username is already taken
            </p>
          )}
          {mode === "register" && usernameStatus === "available" && (
            <p className="username-available">
              <HiOutlineCheckCircle /> Username is available
            </p>
          )}
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
            style={{
              cursor: "pointer",
              marginLeft: "-30px",
              userSelect: "none",
            }}
            onClick={() => setShowPassword((prev) => !prev)}
            title={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <HiEyeSlash /> : <HiEye />}
          </span>
        </div>
        {errorMsg && <div className="auth-error">{errorMsg}</div>}
        <button
          type="submit"
          className="auth-button"
          disabled={
            isLoading ||
            (mode === "register" &&
              (usernameStatus === "taken" || usernameStatus === null))
          }
        >
          {isLoading ? "Loading..." : mode === "login" ? "Login" : "Sign Up"}
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
