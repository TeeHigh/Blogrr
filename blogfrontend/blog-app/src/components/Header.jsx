//components
import Modal from "./Modal";

//icons
import { Button } from '@mui/material';
import { HiOutlineUserCircle } from "react-icons/hi2";

//hooks
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

//styles
import "../styles/Header.scss";
import ProfileMenu from "./ProfileMenu";
import { useState } from "react";

function Header({logout}) {
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
          <ProfileMenu showProfileMenu={showProfileMenu} setShowProfileMenu={setShowProfileMenu} logout={logout} />
        </div>
      ) : (
        <div className="header-buttons">
          <Button onClick={() => navigate("/login")} >
            Sign In
          </Button>
          <Button onClick={() => navigate("/register")} variant="contained" sx={{ bgcolor: 'info.dark'}}>
            Sign Up
          </Button>


        </div>
      )}
    </header>
  );
}

export default Header;
