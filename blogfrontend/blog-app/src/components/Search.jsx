import { HiOutlineSearch } from "react-icons/hi";
import "../styles/DashboardActions.scss";
import "../styles/Search.scss";

function Search({placeholder = "Search blogs..."}) {
  return (
    <span className="search">
      <div className="search-icon-container">
        <HiOutlineSearch className="search-icon" />
      </div>
      <input
        type="search"
        placeholder={placeholder}
        aria-label="Search blogs"
        autoComplete="off"
        className="dashboard-actions__search-input"
      />
    </span>
  );
}

export default Search;
