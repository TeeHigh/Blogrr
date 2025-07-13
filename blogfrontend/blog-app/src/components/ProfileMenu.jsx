import { useEffect, useRef } from "react";
import '../styles/ProfileMenu.scss';
import { HiOutlineChartBar, HiOutlineLogout } from "react-icons/hi";
import { HiOutlineHomeModern } from "react-icons/hi2";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function ProfileMenu({ showProfileMenu, setShowProfileMenu }) {
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { handleLogout } = useAuth();

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };

    if (showProfileMenu) {
      window.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfileMenu]);

  // Determine dynamic nav item based on current route
  const isOnDashboard = location.pathname === "/dashboard";
  const dynamicNavLabel = isOnDashboard ? "Home" : "Dashboard";
  const dynamicNavIcon = isOnDashboard ? <HiOutlineHomeModern /> : <HiOutlineChartBar />;
  const dynamicNavTarget = isOnDashboard ? "/" : "/dashboard";

  const menuTiles = [
    {
      title: dynamicNavLabel,
      icon: dynamicNavIcon,
      callbackFn: () => navigate(dynamicNavTarget),
    },
    {
      title: "Logout",
      icon: <HiOutlineLogout />,
      callbackFn: handleLogout,
    },
  ];

  return (
    <div
      ref={menuRef}
      className="profile-menu"
      style={{ display: showProfileMenu ? "block" : "none" }}
    >
      {menuTiles.map((tile, index) => (
        <button
          key={index}
          onClick={tile.callbackFn}
          className="profile-menu-item"
        >
          <p>{tile.icon}</p>
          <p>{tile.title}</p>
        </button>
      ))}
    </div>
  );
}

export default ProfileMenu;
