import '../styles/ProfileMenu.scss';

import { HiOutlineLogout } from "react-icons/hi";
import { HiOutlineHomeModern } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";

function ProfileMenu({showProfileMenu}) {
  const navigate = useNavigate();

  const menuTiles = [
    {
      title: "Dashboard",
      icon: <HiOutlineHomeModern />,
      callbackFn: navigate("dashboard/"),
    },
    {
      title: "Logout",
      icon: <HiOutlineLogout />,
      callbackFn: console.log('logout'),
    },
  ];
  return (
    <div className="profile-menu">
      {showProfileMenu && menuTiles.map((tile, index) => (
        <button 
          key={index}
          onClick={tile.callbackFn}
          className="profile-menu-item"
        
        >
          {tile.icon}
          {tile.title} 
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
