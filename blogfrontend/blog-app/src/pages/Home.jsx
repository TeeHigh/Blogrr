import React, { useEffect, useState } from "react";
// import useFetchBlogs from "../hooks/useFetchBlogs";
import "../styles/Home.scss";
import { useNavigate } from "react-router-dom";
import BlogsContainer from "../components/BlogsContainer";
import { getBlogs } from "../services/apiBlogs";
import { useGetBlogs } from "../hooks/useGetBlogs";
import Loader from "../components/Loader";
import { useAuth } from "../contexts/AuthContext";
import Search from "../components/Search";
import Footer from "../components/Footer";

const Home = () => {
  const { blogsData = [], isLoadingBlogs } = useGetBlogs();
  const navigate = useNavigate();
  const { isAuthorized } = useAuth();

  return (
    <div>
      {/* Header Section */}
      <header className="header">
        <span onClick={() => navigate("/")}>
          <img src="/assets/logos/BlueOnTransparent.png" className="logo" alt="Blogrr Logo" />
        </span>
        {isAuthorized ? (
          <button className="loginButton" onClick={() => navigate("dashboard/")}>
            Dashboard
          </button>
        ) : (
          <button className="loginButton" onClick={() => navigate("login/")}>
            Login
          </button>
        )}
      </header>

      {/* Blog List Section */}
      {isLoadingBlogs ? (
        <Loader />
      ) : (
        <main className="main">
          {blogsData.length > 0 && (
            <div>
              <h2 className="blog-subheader">Blog Posts</h2>
              <Search/>
            </div>
          )}
          {blogsData.length > 0 ? (
            <BlogsContainer blogs={blogsData} />
          ) : (
            <p className="unavailable">No blogs available. Check back later!</p>
          )}
        </main>
      )}

      
    </div>
  );
};

export default Home;
