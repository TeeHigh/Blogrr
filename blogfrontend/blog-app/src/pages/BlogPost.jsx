import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/BlogPost.scss";
import { useGetBlogById } from "../hooks/useGetBlogById";
import Loader from "../components/Loader";

const BlogPost = () => {
  const { id } = useParams(); // Get the blog ID from the URL
  const navigate = useNavigate(); // For navigation

  const { blogData = {}, isLoadingBlogData } = useGetBlogById(id);

  if (!blogData) return <Loader />;

  const { title, author, created_at, image, content } = blogData;

  return (
    <div className="blog-post">
      <button className="back-button" onClick={() => navigate("/")}>
        &larr; Back to Blogs
      </button>
      {isLoadingBlogData ? (
        <Loader />
      ) : (
        <>
          <h1 className="blog-post__title">{title}</h1>
          <img
            src={
              image ??
              "https://archive.org/download/placeholder-image/placeholder-image.jpg"
            }
            alt={title}
            className="blog-post__image"
          />
          <p className="blog-post__meta">
            By <span className="blog-post__author">{author}</span> |{" "}
            <span className="blog-post__date">
              {!created_at
                ? ""
                : new Intl.DateTimeFormat("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  }).format(new Date(created_at))}
            </span>
          </p>
          <hr />
          <div
            className="blog-post__content"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </>
      )}
    </div>
  );
};

export default BlogPost;
