import React from "react";
import BlogItem from "./BlogItem";
import "../styles/BlogsContainer.scss";

function BlogsContainer({ blogs }) {
  return (
    <div className="blogs-container">
      {blogs.map((blog) => {
        return <BlogItem key={blog.id} blog={blog} />;
      })}
    </div>
  );
}

export default BlogsContainer;
