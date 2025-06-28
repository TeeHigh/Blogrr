import React from "react";
import "../styles/BlogItem.scss";
import { Link } from "react-router-dom";

function BlogItem({ blog }) {
  const { id, image, created_at, title, author } = blog;

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(created_at));

  return (
    <div className="blog-item">
      <img src="https://archive.org/download/placeholder-image/placeholder-image.jpg" alt={title} className="blog-item__image" />
      <div className="blog-item__content">
        <Link className="blog-item__title" to={`/post/${id}`}>
          <h3>{title}</h3>
        </Link>
        <p className="blog-item__meta">
          <span className="blog-item__author">By {author}</span> |{" "}
          <span className="blog-item__date">{formattedDate}</span>
        </p>
      </div>
    </div>
  );
}

export default BlogItem;