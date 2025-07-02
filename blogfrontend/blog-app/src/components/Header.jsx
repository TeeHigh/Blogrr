//components
import Modal from "./Modal";

//icons
import { HiOutlineLogout } from "react-icons/hi";
import { HiOutlineUserCircle } from "react-icons/hi2";

//hooks
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

//styles
import "../styles/Header.scss";
import ProfileMenu from "./ProfileMenu";
import { useState } from "react";

function Header() {
  const navigate = useNavigate();
  const { isAuthorized } = useAuth();

  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const toggleProfileMenu = () => {
    setShowProfileMenu((prev) => !prev);
  };

  return (
    <header className="header">
      <span onClick={() => navigate("/")}>
        <img
          src="/assets/logos/BlueOnTransparent.png"
          className="logo"
          alt="Blogrr Logo"
        />
      </span>
      {isAuthorized ? (
        <div className="header-profile">
          <HiOutlineUserCircle className="profile-icon" onClick={toggleProfileMenu} />
          <ProfileMenu showProfileMenu={showProfileMenu} />
        </div>
      ) : (
        <button className="loginButton" onClick={() => navigate("login/")}>
          Login
        </button>
      )}
    </header>
  );
}

export default Header;
