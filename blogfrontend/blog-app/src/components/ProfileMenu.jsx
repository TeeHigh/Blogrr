import '../styles/ProfileMenu.scss';

import { HiOutlineLogout } from "react-icons/hi";
import { HiOutlineHomeModern } from "react-icons/hi2";
import { useNavigate, useParams } from "react-router-dom";

function ProfileMenu({showProfileMenu, logout}) {
  const navigate = useNavigate();

  const menuTiles = [
    {
      title: "Dashboard",
      icon: <HiOutlineHomeModern />,
      callbackFn: () => navigate("/dashboard"),
    },
    {
      title: "Logout",
      icon: <HiOutlineLogout />,
      callbackFn: () => logout(),
    },
  ];
  return (
    <div className="profile-menu" style={!showProfileMenu ? {visibility: 'none'} : {}}>
      {showProfileMenu && menuTiles.map((tile, index) => (
        <button 
          key={index}
          onClick={tile.callbackFn}
          className="profile-menu-item"
        
        >
          <p>{tile.icon}</p>
          <p>{tile.title}</p>
        </button>
      ))}

      {/* <button className="loginButton" onClick={() => navigate("dashboard/")}>
        Dashboard
      </button>

      <button className="logout-button">Logout</button> */}
    </div>
  );
}

export default ProfileMenu;
