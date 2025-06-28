import { useState } from "react";
import Search from "./Search";

function DashboardActions() {
  const [activeTab, setActiveTab] = useState("My Blogs");

  const tabs = ["My Blogs", "Archived Blogs", "Drafts"];

  return (
    <div className="dashboard-actions">
      <div className="dashboard-actions__tabs">
        {tabs.map((tab) => (
        <button
          key={tab}
          className={`dashboard-actions__tab ${activeTab === tab ? "active" : ""}`}
          onClick={() => setActiveTab(tab)}
        >
          {tab}
        </button>
      ))}
      </div>
      <Search/>
    </div>
  );
}

export default DashboardActions;
