import { useState, useEffect } from "react";
import { Navigate, NavLink, useNavigate } from "react-router-dom";
import { HiOutlineLogout } from "react-icons/hi";
import { HiPlus } from "react-icons/hi2";

import { useAuth } from "../contexts/AuthContext";
import useIdleLogout from "../hooks/useIdleLogout";
import { useDashboardData } from "../hooks/useDashboardData";
import { useDeleteBlog } from "../hooks/useDeleteBlog";

import DashboardBlogItem from "../components/DashboardBlogItem";
import Loader from "../components/Loader";
import Modal from "../components/Modal";
import NewEditBlog from "../components/NewEditBlog";
import ConfirmationModal from "../components/ConfirmationModal";

import "../styles/Dashboard.scss";
import DashboardActions from "../components/DashboardActions";

const Dashboard = () => {
  const { setIsAuthorized } = useAuth();
  const [loggedOut, setLoggedOut] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { deleteBlog, isDeletingBlog } = useDeleteBlog();
  const { dashboardData = {}, isLoadingDashboardData } = useDashboardData();
  
  const AUTO_LOGOUT_TIME = 15 * 60 * 1000; // 15 minutes

  const navigate = useNavigate();

  const handleEdit = () => {
    setIsModalOpen(true);
  };

  const handleCreateBlog = () => {
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    console.log(`Delete blog with ID: ${id}`);
    deleteBlog(id);
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthorized(false);
    setLoggedOut(true);
  };

  useIdleLogout({ logoutCallback: handleLogout, timeout: AUTO_LOGOUT_TIME });

  if (isLoadingDashboardData) return <Loader />;

  if (!dashboardData) return;

  const blogsData = dashboardData.blogs || [];

  if (loggedOut) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Modal>
        <div>
          <header className="dashboard-header">
            <span onClick={() => navigate("/")}>
              <img src="/assets/logos/BlueOnTransparent.png" className="logo" alt="Blogrr Logo" />
            </span>
            <div className="dashboard-header__actions">
              <Modal.Open opens="newBlogModal">
                <button className="add-blog-button" onClick={handleCreateBlog}>
                  Add New Blog <HiPlus />
                </button>
              </Modal.Open>

              <Modal.Open>
                <button className="logout-button">
                  Logout <HiOutlineLogout />
                </button>
              </Modal.Open>
            </div>
          </header>
          <hr />
          <span className="welcome-message-and-button">
            <NavLink to="/" className="back-to-home">
              ⇐
            </NavLink>
            <h2 className="dashboard-header">Dashboard</h2>
            <h2 className="welcome-text">
              👋 Welcome, {dashboardData?.author?.username}!
            </h2>
          </span>

          <DashboardActions />

          {/* <p>Manage your blog posts here.</p> */}
          <div className="dashboard-blogs">
            {blogsData.length > 0 ? (
              blogsData.map((blog) => (
                <DashboardBlogItem
                  key={blog.id}
                  blog={blog}
                  onEdit={handleEdit}
                  onDelete={() => handleDelete(blog.id)}
                />
              ))
            ) : (
              <p className="no-blogs-message">
                You have no blogs. Start creating one!
              </p>
            )}
          </div>
        </div>
        <Modal.Window name="newBlogModal">
          <NewEditBlog mode="create" closeModal={() => setIsModalOpen(false)} />
        </Modal.Window>
        <Modal.Window>
          <ConfirmationModal
            onConfirm={handleLogout}
            isWorking={isDeletingBlog}
          >
            <p style={{ padding: "2rem" }}>Are you sure you want to logout?</p>
          </ConfirmationModal>
        </Modal.Window>
      </Modal>
    </>
  );
};

export default Dashboard;
