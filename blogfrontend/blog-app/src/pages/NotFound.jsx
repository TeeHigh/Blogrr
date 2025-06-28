import React from 'react'
import "../styles/NotFound.scss";
import { HiHome } from 'react-icons/hi2';

function NotFound() {
  return (
    <div className="not-found-container">
      <h1>404 Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <a href="/" style={{display: 'flex', alignItems: 'baseline', gap: '10px'}}><HiHome/> Go back to Home</a>
    </div>
  )
}

export default NotFound