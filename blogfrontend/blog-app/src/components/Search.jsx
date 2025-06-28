import { HiOutlineSearch } from "react-icons/hi";
import "../styles/DashboardActions.scss";
import "../styles/Search.scss";

function Search() {
  return (
    <span className="search">
        <HiOutlineSearch className="search-icon" />
        <input
          type="search"
          placeholder="Search blogs..."
          className="dashboard-actions__search-input"
        />
      </span>
  )
}

export default Search